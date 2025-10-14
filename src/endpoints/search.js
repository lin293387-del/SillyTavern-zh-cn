import fetch from 'node-fetch';
import express from 'express';

import { decode } from 'html-entities';
import { readSecret, SECRET_KEYS } from './secrets.js';
import { trimV1 } from '../util.js';
import { setAdditionalHeaders } from '../additional-headers.js';

export const router = express.Router();

// Cosplay as Chrome
const visitHeaders = {
    'Accept': 'text/html',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'TE': 'trailers',
    'DNT': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
};

/**
 * Extract the transcript of a YouTube video
 * @param {string} videoPageBody HTML of the video page
 * @param {string} lang Language code
 * @returns {Promise<string>} Transcript text
 */
async function extractTranscript(videoPageBody, lang) {
    const RE_XML_TRANSCRIPT = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
    const splittedHTML = videoPageBody.split('"captions":');

    if (splittedHTML.length <= 1) {
        if (videoPageBody.includes('class="g-recaptcha"')) {
            throw new Error('请求过多，请稍后再试');
        }
        if (!videoPageBody.includes('"playabilityStatus":')) {
            throw new Error('视频不可用');
        }
        throw new Error('暂无可用字幕');
    }

    const captions = (() => {
        try {
            return JSON.parse(splittedHTML[1].split(',"videoDetails')[0].replace('\n', ''));
        } catch (e) {
            return undefined;
        }
    })()?.['playerCaptionsTracklistRenderer'];

    if (!captions) {
        throw new Error('字幕功能已关闭');
    }

    if (!('captionTracks' in captions)) {
        throw new Error('暂无可用字幕');
    }

    if (lang && !captions.captionTracks.some(track => track.languageCode === lang)) {
        throw new Error('该语言暂未提供字幕');
    }

    const transcriptURL = (lang ? captions.captionTracks.find(track => track.languageCode === lang) : captions.captionTracks[0]).baseUrl;
    const transcriptResponse = await fetch(transcriptURL, {
        headers: {
            ...(lang && { 'Accept-Language': lang }),
            'User-Agent': visitHeaders['User-Agent'],
        },
    });

    if (!transcriptResponse.ok) {
        throw new Error('获取字幕失败');
    }

    const transcriptBody = await transcriptResponse.text();
    const results = [...transcriptBody.matchAll(RE_XML_TRANSCRIPT)];
    const transcript = results.map((result) => ({
        text: result[3],
        duration: parseFloat(result[2]),
        offset: parseFloat(result[1]),
        lang: lang ?? captions.captionTracks[0].languageCode,
    }));
    // The text is double-encoded
    const transcriptText = transcript.map((line) => decode(decode(line.text))).join(' ');
    return transcriptText;
}

router.post('/serpapi', async (request, response) => {
    try {
        const key = readSecret(request.user.directories, SECRET_KEYS.SERPAPI);

        if (!key) {
            console.error('未找到 SerpApi 密钥');
            return response.sendStatus(400);
        }

        const { query } = request.body;
        const result = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${key}`);

        console.debug('SerpApi 查询', query);

        if (!result.ok) {
            const text = await result.text();
            console.error('SerpApi 请求失败', result.statusText, text);
            return response.status(500).send(text);
        }

        const data = await result.json();
        console.debug('SerpApi 响应', data);
        return response.json(data);
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
});

/**
 * Get the transcript of a YouTube video
 * @copyright https://github.com/Kakulukian/youtube-transcript (MIT License)
 */
router.post('/transcript', async (request, response) => {
    try {
        const id = request.body.id;
        const lang = request.body.lang;
        const json = request.body.json;

        if (!id) {
            console.error('调用 /transcript 时必须提供 id');
            return response.sendStatus(400);
        }

        const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${id}`, {
            headers: {
                ...(lang && { 'Accept-Language': lang }),
                'User-Agent': visitHeaders['User-Agent'],
            },
        });

        const videoPageBody = await videoPageResponse.text();

        try {
            const transcriptText = await extractTranscript(videoPageBody, lang);
            return json
                ? response.json({ transcript: transcriptText, html: videoPageBody })
                : response.send(transcriptText);
        } catch (error) {
            if (json) {
                return response.json({ html: videoPageBody, transcript: '' });
            }
            throw error;
        }
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
});

router.post('/searxng', async (request, response) => {
    try {
        const { baseUrl, query, preferences, categories } = request.body;

        if (!baseUrl || !query) {
            console.error('缺少 /searxng 所需参数');
            return response.sendStatus(400);
        }

        console.debug('SearXNG 查询', baseUrl, query);

        const mainPageUrl = new URL(baseUrl);
        const mainPageRequest = await fetch(mainPageUrl, { headers: visitHeaders });

        if (!mainPageRequest.ok) {
            console.error('SearXNG 请求失败', mainPageRequest.statusText);
            return response.sendStatus(500);
        }

        const mainPageText = await mainPageRequest.text();
        const clientHref = mainPageText.match(/href="(\/client.+\.css)"/)?.[1];

        if (clientHref) {
            const clientUrl = new URL(clientHref, baseUrl);
            await fetch(clientUrl, { headers: visitHeaders });
        }

        const searchUrl = new URL('/search', baseUrl);
        const searchParams = new URLSearchParams();
        searchParams.append('q', query);
        if (preferences) {
            searchParams.append('preferences', preferences);
        }
        if (categories) {
            searchParams.append('categories', categories);
        }
        searchUrl.search = searchParams.toString();

        const searchResult = await fetch(searchUrl, { headers: visitHeaders });

        if (!searchResult.ok) {
            const text = await searchResult.text();
            console.error('SearXNG 请求失败', searchResult.statusText, text);
            return response.sendStatus(500);
        }

        const data = await searchResult.text();
        return response.send(data);
    } catch (error) {
        console.error('SearXNG 请求失败', error);
        return response.sendStatus(500);
    }
});

router.post('/tavily', async (request, response) => {
    try {
        const apiKey = readSecret(request.user.directories, SECRET_KEYS.TAVILY);

        if (!apiKey) {
            console.error('未找到 Tavily 密钥');
            return response.sendStatus(400);
        }

        const { query, include_images } = request.body;

        const body = {
            query: query,
            api_key: apiKey,
            search_depth: 'basic',
            topic: 'general',
            include_answer: true,
            include_raw_content: false,
            include_images: !!include_images,
            include_image_descriptions: false,
            include_domains: [],
            max_results: 10,
        };

        const result = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.debug('Tavily 查询', query);

        if (!result.ok) {
            const text = await result.text();
            console.error('Tavily 请求失败', result.statusText, text);
            return response.status(500).send(text);
        }

        const data = await result.json();
        console.debug('Tavily 响应', data);
        return response.json(data);
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
});

router.post('/koboldcpp', async (request, response) => {
    try {
        const { query, url } = request.body;

        if (!url) {
            console.error('未提供 KoboldCpp 搜索所需的 URL');
            return response.sendStatus(400);
        }

        console.debug('KoboldCpp 搜索请求', query);

        const baseUrl = trimV1(url);
        const args = {
            method: 'POST',
            headers: {},
            body: JSON.stringify({ q: query }),
        };

        setAdditionalHeaders(request, args, baseUrl);
        const result = await fetch(`${baseUrl}/api/extra/websearch`, args);

        if (!result.ok) {
            const text = await result.text();
            console.error('KoboldCpp 请求失败', result.statusText, text);
            return response.status(500).send(text);
        }

        const data = await result.json();
        console.debug('KoboldCpp 搜索响应', data);
        return response.json(data);
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
});

router.post('/serper', async (request, response) => {
    try {
        const key = readSecret(request.user.directories, SECRET_KEYS.SERPER);

        if (!key) {
            console.error('未找到 Serper 密钥');
            return response.sendStatus(400);
        }

        const { query, images } = request.body;

        const url = images
            ? 'https://google.serper.dev/images'
            : 'https://google.serper.dev/search';

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                'X-API-KEY': key,
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            body: JSON.stringify({ q: query }),
        });

        console.debug('Serper 查询', query);

        if (!result.ok) {
            const text = await result.text();
            console.warn('Serper 请求失败', result.statusText, text);
            return response.status(500).send(text);
        }

        const data = await result.json();
        console.debug('Serper 响应', data);
        return response.json(data);
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
});

router.post('/visit', async (request, response) => {
    try {
        const url = request.body.url;
        const html = Boolean(request.body.html ?? true);

        if (!url) {
            console.error('调用 /visit 时未提供 URL');
            return response.sendStatus(400);
        }

        try {
            const urlObj = new URL(url);

            // Reject relative URLs
            if (urlObj.protocol === null || urlObj.host === null) {
                throw new Error('URL 格式不合法');
            }

            // Reject non-HTTP URLs
            if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
                throw new Error('协议不受支持');
            }

            // Reject URLs with a non-standard port
            if (urlObj.port !== '') {
                throw new Error('端口不合法');
            }

            // Reject IP addresses
            if (urlObj.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
                throw new Error('主机名不合法');
            }
        } catch (error) {
            console.error('提供给 /visit 的 URL 无效', url);
            return response.sendStatus(400);
        }

        console.info('正在访问网页', url);

        const result = await fetch(url, { headers: visitHeaders });

        if (!result.ok) {
            console.error(`访问失败 ${result.status} ${result.statusText}`);
            return response.sendStatus(500);
        }

        const contentType = String(result.headers.get('content-type'));

        if (html) {
            if (!contentType.includes('text/html')) {
                console.error(`访问失败，返回的 content-type 为 ${contentType}，预期为 text/html`);
                return response.sendStatus(500);
            }

            const text = await result.text();
            return response.send(text);
        }

        response.setHeader('Content-Type', contentType);
        const buffer = await result.arrayBuffer();
        return response.send(Buffer.from(buffer));
    } catch (error) {
        console.error(error);
        return response.sendStatus(500);
    }
});
