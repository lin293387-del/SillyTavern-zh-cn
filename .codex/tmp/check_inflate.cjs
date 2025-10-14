const fs = require('fs');
const zlib = require('zlib');

const filePath = process.argv[2] || '内存分析.heaptimeline';
const data = fs.readFileSync(filePath);

function tryMethod(label, fn) {
    try {
        fn();
        console.log(label);
        return true;
    } catch (error) {
        return false;
    }
}

if (tryMethod('gzip', () => zlib.gunzipSync(data))) {
    process.exit(0);
}
if (tryMethod('inflate', () => zlib.inflateSync(data))) {
    process.exit(0);
}
if (tryMethod('brotli', () => zlib.brotliDecompressSync(data))) {
    process.exit(0);
}
console.log('unknown compression');
