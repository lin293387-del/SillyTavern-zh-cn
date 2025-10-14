await import('./worker-globals.js');
const { createWorkerHost } = await import('./worker-host.js');

function collapseNewlines(text) {
    return text.replace(/\n+/g, '\n');
}

function postProcessText(text, collapse = true) {
    text = text.replace(/\r/g, '');
    text = text.replace(/\t/g, ' ');
    text = text.replace(/\u00A0/g, ' ');

    if (collapse) {
        text = collapseNewlines(text);
        text = text.split('\n').map(l => l.trim()).filter(Boolean).join('\n');
    } else {
        text = text.replace(/\n{4,}/g, '\n\n\n\n');
        text = text.split('\n').map(l => /^\s+$/.test(l) ? '' : l).join('\n');
    }

    text = text.replace(/ {2,}/g, ' ');
    return text.trim();
}

function resolveBlob(payload) {
    if (payload && payload.blob instanceof Blob) {
        return payload.blob;
    }

    if (payload?.buffer) {
        return new Blob([payload.buffer], { type: payload?.mimeType || 'application/octet-stream' });
    }

    return null;
}

async function ensurePdfLib() {
    if (!self.pdfjsLib) {
        await import('../../lib/pdf.min.mjs');
    }

    if (!self.pdfjsWorker) {
        await import('../../lib/pdf.worker.min.mjs');
    }
}

async function ensureEpubLib() {
    if (!self.JSZip) {
        await import('../../lib/jszip.min.js');
    }

    if (!self.ePub) {
        await import('../../lib/epub.min.js');
    }
}

async function handlePdf(payload) {
    const blob = resolveBlob(payload);
    if (!(blob instanceof Blob)) {
        return { text: '' };
    }

    await ensurePdfLib();

    const buffer = await blob.arrayBuffer();
    const pdf = await self.pdfjsLib.getDocument(buffer).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        pages.push(text);
    }

    return { text: postProcessText(pages.join('\n')) };
}

async function handleMarkdown(payload) {
    const blob = resolveBlob(payload);
    if (!(blob instanceof Blob)) {
        return { text: '' };
    }

    const markdown = await blob.text();
    return { text: postProcessText(markdown, false) };
}

async function handleEpub(payload) {
    const blob = resolveBlob(payload);
    if (!(blob instanceof Blob)) {
        return { text: '' };
    }

    await ensureEpubLib();

    const book = self.ePub(blob);
    await book.ready;
    const sectionPromises = [];

    book.spine.each((section) => {
        const sectionPromise = (async () => {
            try {
                const chapter = await book.load(section.href);
                const isDocument = typeof Document !== 'undefined' && chapter instanceof Document;
                if (!isDocument || !chapter.body?.textContent) {
                    return '';
                }
                return chapter.body.textContent.trim();
            } catch (error) {
                console.warn('[Worker][epub] Failed to load section', error);
                return '';
            }
        })();

        sectionPromises.push(sectionPromise);
    });

    const content = await Promise.all(sectionPromises);
    const text = content.filter(Boolean);
    return { text: postProcessText(text.join('\n'), false) };
}

createWorkerHost(async (payload) => {
    if (!payload || typeof payload.kind !== 'string') {
        return { text: '' };
    }

    switch (payload.kind) {
        case 'pdf':
            return await handlePdf(payload);
        case 'markdown':
            return await handleMarkdown(payload);
        case 'epub':
            return await handleEpub(payload);
        default:
            throw new Error(`Unsupported document task: ${payload.kind}`);
    }
});
