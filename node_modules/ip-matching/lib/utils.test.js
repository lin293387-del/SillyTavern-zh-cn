"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ip_1 = require("./ip");
const utils_1 = require("./utils");
const toString = (obj) => `${obj}`;
function validateMatches(original, processed, ips) {
    for (const ip of ips) {
        const a = original.some(m => m.matches(ip));
        const b = processed.some(m => m.matches(ip));
        if (a === b)
            continue;
        fail(`Expected ${a} for ${ip} but got ${b}`);
    }
}
function validateRandom(original, processed, clazz) {
    const ips = [];
    for (let i = 0; i < 1000; i++) {
        const bits = [];
        for (let i = 0; i < clazz.bits; i++)
            bits[i] = Math.random() < 0.5 ? 0 : 1;
        ips.push(clazz.fromBits(bits));
    }
    validateMatches(original, processed, ips);
}
function findEdgeCases(matches) {
    const cases = [];
    for (const match of matches) {
        for (const mask of match.convertToMasks()) {
            cases.push(mask.ip);
            const prev = mask.ip.getPrevious();
            if (prev)
                cases.push(prev);
            const next = mask.ip.getNext();
            if (next)
                cases.push(next);
            const ipParts = [...mask.ip.parts];
            const maskParts = mask.mask.parts;
            const maxPart = (2 ** (mask.ip.bits / ipParts.length)) - 1;
            for (let i = 0; i < ipParts.length; i++) {
                ipParts[i] = ipParts[i] | (maxPart & maskParts[i]);
            }
            const ip = ip_1.partsToIP(ipParts);
            cases.push(ip);
            const ipPrev = ip.getPrevious();
            if (ipPrev)
                cases.push(ipPrev);
            const ipNext = ip.getNext();
            if (ipNext)
                cases.push(ipNext);
        }
    }
    return cases;
}
function validateEdges(original, processed) {
    const ips = [...findEdgeCases(original), ...findEdgeCases(processed)];
    validateMatches(original, processed, ips);
}
describe('compactMasks', () => {
    describe('IPv4 set 1', () => {
        const masks = [
            ip_1.getMatch('10.0.0.0/255.0.255.0'),
            ip_1.getMatch('10.0.0.0/255.0.255.0'),
            ip_1.getMatch('10.0.0.0/255.255.1.0'),
            ip_1.getMatch('10.0.0.0/255.255.0.255'),
            ip_1.getMatch('11.0.0.0/255.0.255.0'),
            ip_1.getMatch('20.1.2.3/255.0.0.0'),
            ip_1.getMatch('20.1.2.3/0.255.0.0'),
            ip_1.getMatch('20.1.2.3/255.255.0.0'),
        ];
        const compacted = utils_1.compactMasks(masks);
        const expected = [
            ip_1.getMatch('0.1.0.0/0.255.0.0'),
            ip_1.getMatch('10.0.0.0/254.0.255.0'),
            ip_1.getMatch('10.0.0.0/255.255.0.255'),
            ip_1.getMatch('10.0.0.0/255.255.1.0'),
            ip_1.getMatch('20.0.0.0/255.0.0.0'),
        ].map(toString).sort();
        test('matches expected', () => {
            expect(compacted.map(toString).sort()).toEqual(expected);
        });
        test('validate edge cases', () => {
            validateEdges(masks, compacted);
        });
        test('validate 1000 random addresses', () => {
            validateRandom(masks, compacted, ip_1.IPv4);
        });
        test('validate first two octets', () => {
            let ip = ip_1.getMatch('0.0.0.0');
            const parts = ip.parts;
            for (let i = 0; i <= 255 * 255; i++) {
                parts[0] = i >> 8;
                parts[1] = i & 255;
                ip = ip_1.partsToIP(parts);
                const a = masks.some(m => m.matches(ip));
                const b = compacted.some(m => m.matches(ip));
                if (a === b)
                    continue;
                fail(`Expected ${a} for ${ip} but got ${b}`);
            }
        });
    });
    describe('IPv6 set 1', () => {
        const masks = [
            ip_1.getMatch('a:b:c:d::/ffff::'),
            ip_1.getMatch('a:b:c:d::/ffff::'),
            ip_1.getMatch('a:b:c:d::/0:ffff::'),
            ip_1.getMatch('a:b:c:d::/ffff:ffff::'),
            ip_1.getMatch('b:b:c:d::/ffff::'),
            ip_1.getMatch('fa:b:c:d::/ffff::'),
            ip_1.getMatch('fb:b:c:d::/ffff::'),
            ip_1.getMatch('8888:1:2:3::/ffff::'),
            ip_1.getMatch('8888:1:2:3::/0:ffff::'),
            ip_1.getMatch('8888:1:2:3::/ffff:ffff::'),
        ];
        const compacted = utils_1.compactMasks(masks);
        const expected = [
            ip_1.getMatch('0:1::/0:ffff::'),
            ip_1.getMatch('0:b::/0:ffff::'),
            ip_1.getMatch('a::/fffe::'),
            ip_1.getMatch('fa::/fffe::'),
            ip_1.getMatch('8888::/ffff::'),
        ].map(toString).sort();
        test('matches expected', () => {
            expect(compacted.map(toString).sort()).toEqual(expected);
        });
        test('validate edge cases', () => {
            validateEdges(masks, compacted);
        });
        test('validate 1000 random addresses', () => {
            validateRandom(masks, compacted, ip_1.IPv6);
        });
        test('validate first hextet', () => {
            let ip = ip_1.getMatch('0::');
            const parts = ip.parts;
            for (let i = 0; i <= 0xffff; i++) {
                parts[0] = i;
                ip = ip_1.partsToIP(parts);
                const a = masks.some(m => m.matches(ip));
                const b = compacted.some(m => m.matches(ip));
                if (a === b)
                    continue;
                fail(`Expected ${a} for ${ip} but got ${b}`);
            }
        });
    });
});
//# sourceMappingURL=utils.test.js.map