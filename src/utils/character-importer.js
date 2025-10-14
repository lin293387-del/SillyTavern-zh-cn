import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';

import sanitize from 'sanitize-filename';
import yaml from 'yaml';
import _ from 'lodash';

import { DEFAULT_AVATAR_PATH } from '../constants.js';
import { ByafParser } from '../byaf.js';
import { read as readCardFromPng } from '../character-card-parser.js';
import { extractFileFromZipBuffer, humanizedISO8601DateTime, tryParse } from '../util.js';
import { convertToV2, readFromV2, unsetPrivateFields } from '../endpoints/characters.js';

const SUPPORTED_EXTENSIONS = ['.json', '.jsonl', '.png', '.yaml', '.yml', '.charx', '.byaf'];

/**
 * 尝试从 buffer 解析角色卡片，返回标准化的 Spec V2 数据与头像。
 * @param {Buffer} buffer 上传文件的数据
 * @param {string} originalName 原始文件名
 * @param {import('../users.js').UserDirectoryList} directories 用户目录
 * @param {{ preserveFileName?: string }} [options]
 * @returns {Promise<{ format: string, card: any, avatar: { mimeType: string, data: string }, name: string, suggestedInternalName: string, warnings: string[] }>}
 */
export async function parseCharacterBuffer(buffer, originalName, directories, options = {}) {
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('buffer must be a Buffer');
    }

    const extension = path.extname(originalName || '').toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
        throw new Error(`Unsupported character format: ${extension || 'unknown'}`);
    }

    const preservedName = options.preserveFileName ? sanitize(options.preserveFileName) : '';
    const warnings = [];

    let avatarBuffer = await fs.promises.readFile(DEFAULT_AVATAR_PATH);
    let resultCard;
    let detectedFormat = extension.replace('.', '') || 'json';

    const setAvatarIfValid = (candidate) => {
        if (candidate instanceof Buffer && candidate.length > 0) {
            avatarBuffer = candidate;
        }
    };

    const resolveInternalName = (rawName) => {
        const safe = sanitize(rawName || 'character');
        if (!safe) {
            return `character-${Date.now()}`;
        }
        return safe;
    };

    const finalizeCard = (card) => {
        if (!card) {
            throw new Error('Parsed card data is empty');
        }
        if (!card.create_date) {
            card.create_date = humanizedISO8601DateTime();
        }
        if (!card.chat) {
            card.chat = `${card.name || card.data?.name || 'Chat'} - ${humanizedISO8601DateTime()}`;
        }
        return card;
    };

    switch (extension) {
        case '.yaml':
        case '.yml': {
            const yamlData = yaml.parse(buffer.toString('utf8'));
            if (!yamlData?.name) {
                throw new Error('YAML character file missing name field');
            }
            yamlData.name = sanitize(yamlData.name);
            const card = convertToV2({
                name: yamlData.name,
                description: yamlData.context ?? '',
                first_mes: yamlData.greeting ?? '',
                chat: `${yamlData.name} - ${humanizedISO8601DateTime()}`,
                creatorcomment: yamlData.creatorcomment ?? '',
                personality: '',
                scenario: '',
                mes_example: '',
                create_date: humanizedISO8601DateTime(),
                talkativeness: 0.5,
                creator: '',
                tags: '',
            }, directories);
            resultCard = finalizeCard(card);
            break;
        }
        case '.charx': {
            const archive = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
            const cardBuffer = await extractFileFromZipBuffer(archive, 'card.json');
            if (!cardBuffer) {
                throw new Error('CharX file missing card.json');
            }
            const cardJson = JSON.parse(cardBuffer.toString('utf8'));
            unsetPrivateFields(cardJson);
            let parsed = readFromV2(cardJson);
            parsed.create_date = humanizedISO8601DateTime();
            const assets = _.get(cardJson, 'data.assets');
            if (Array.isArray(assets)) {
                for (const asset of assets.filter((x) => x.type === 'icon' && typeof x.uri === 'string')) {
                    const pathNoProtocol = String(asset.uri.replace(/^(?:\/\/|[^/]+)*\//, ''));
                    const candidate = await extractFileFromZipBuffer(archive, pathNoProtocol);
                    if (candidate) {
                        setAvatarIfValid(Buffer.from(candidate));
                        break;
                    }
                }
            }
            resultCard = finalizeCard(parsed);
            break;
        }
        case '.byaf': {
            const parser = new ByafParser(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
            const byafData = await parser.parse();
            const cardJson = readFromV2(byafData.card);
            cardJson.create_date = humanizedISO8601DateTime();
            setAvatarIfValid(Buffer.from(byafData.image));
            resultCard = finalizeCard(cardJson);
            break;
        }
        case '.png': {
            const metadata = readCardFromPng(buffer);
            const jsonData = JSON.parse(metadata);
            if (jsonData.spec) {
                unsetPrivateFields(jsonData);
                let parsed = readFromV2(jsonData);
                parsed.create_date = humanizedISO8601DateTime();
                resultCard = finalizeCard(parsed);
                setAvatarIfValid(Buffer.from(buffer));
            } else {
                let char = migrateLegacyJson(jsonData, directories, warnings);
                resultCard = finalizeCard(char);
                setAvatarIfValid(Buffer.from(buffer));
            }
            break;
        }
        case '.jsonl':
        case '.json': {
            const jsonText = buffer.toString('utf8');
            // Detect JSONL by newline
            if (extension === '.jsonl' || jsonText.trim().includes('\n') && jsonText.trim().split('\n').length > 1) {
                throw new Error('JSONL is not supported for character import');
            }
            const jsonData = JSON.parse(jsonText);
            if (jsonData.spec) {
                unsetPrivateFields(jsonData);
                let parsed = readFromV2(jsonData);
                parsed.create_date = humanizedISO8601DateTime();
                resultCard = finalizeCard(parsed);
            } else {
                resultCard = finalizeCard(migrateLegacyJson(jsonData, directories, warnings));
            }
            break;
        }
        default:
            throw new Error(`Unsupported character format: ${extension}`);
    }

    const cardName = resultCard?.data?.name || resultCard?.name || 'character';
    const finalName = resolveInternalName(cardName);
    const suggestedInternalName = preservedName || finalName;

    return {
        format: detectedFormat,
        card: resultCard,
        avatar: {
            mimeType: 'image/png',
            data: avatarBuffer.toString('base64'),
        },
        name: cardName,
        suggestedInternalName,
        warnings,
    };
}

function migrateLegacyJson(jsonData, directories, warnings) {
    if (jsonData.spec !== undefined) {
        unsetPrivateFields(jsonData);
        const parsed = readFromV2(jsonData);
        parsed.create_date = humanizedISO8601DateTime();
        return parsed;
    }

    if (jsonData.name !== undefined) {
        if (jsonData.creator_notes) {
            jsonData.creator_notes = jsonData.creator_notes.replace("Creator's notes go here.", '');
        }
        const card = convertToV2({
            name: sanitize(jsonData.name),
            description: jsonData.description ?? '',
            creatorcomment: jsonData.creatorcomment ?? jsonData.creator_notes ?? '',
            personality: jsonData.personality ?? '',
            first_mes: jsonData.first_mes ?? '',
            scenario: jsonData.scenario ?? '',
            mes_example: jsonData.mes_example ?? '',
            create_date: humanizedISO8601DateTime(),
            chat: `${jsonData.name} - ${humanizedISO8601DateTime()}`,
            talkativeness: jsonData.talkativeness ?? 0.5,
            creator: jsonData.creator ?? '',
            tags: jsonData.tags ?? '',
        }, directories);
        return card;
    }

    if (jsonData.char_name !== undefined) {
        if (jsonData.creator_notes) {
            jsonData.creator_notes = jsonData.creator_notes.replace("Creator's notes go here.", '');
        }
        const card = convertToV2({
            name: sanitize(jsonData.char_name),
            description: jsonData.char_persona ?? '',
            creatorcomment: jsonData.creatorcomment ?? jsonData.creator_notes ?? '',
            personality: '',
            first_mes: jsonData.char_greeting ?? '',
            scenario: jsonData.world_scenario ?? '',
            mes_example: jsonData.example_dialogue ?? '',
            create_date: humanizedISO8601DateTime(),
            chat: `${jsonData.char_name} - ${humanizedISO8601DateTime()}`,
            talkativeness: jsonData.talkativeness ?? 0.5,
            creator: jsonData.creator ?? '',
            tags: jsonData.tags ?? '',
        }, directories);
        return card;
    }

    // Try legacy / minimal format fallback
    const fallback = convertToV2({
        name: sanitize(jsonData?.name || 'Character'),
        description: jsonData?.description ?? '',
        creatorcomment: jsonData?.creatorcomment ?? '',
        personality: jsonData?.personality ?? '',
        first_mes: jsonData?.first_mes ?? '',
        scenario: jsonData?.scenario ?? '',
        mes_example: jsonData?.mes_example ?? '',
        create_date: humanizedISO8601DateTime(),
        chat: `${jsonData?.name || 'Character'} - ${humanizedISO8601DateTime()}`,
        talkativeness: jsonData?.talkativeness ?? 0.5,
        creator: jsonData?.creator ?? '',
        tags: jsonData?.tags ?? '',
    }, directories);
    warnings.push('Character JSON format unrecognized, used best-effort conversion.');
    return fallback;
}
