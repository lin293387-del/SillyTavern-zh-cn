"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPMask = exports.IPSubnetwork = exports.IPRange = exports.partsToIP = exports.getIP = exports.IPv6 = exports.IPv4 = exports.IPMatch = exports.getMatch = void 0;
const IP4_REGEX = /^(\d{1,3}\.|\*\.){3}(\d{1,3}|\*)$/;
// https://regexr.com/5e5i7
const IP6_REGEX = /^((([a-f\d]{1,4}|\*)::?)+([a-f\d]{1,4}|\*)|:(:[a-f\d]{1,4}|:\*)+|([a-f\d]{1,4}:|\*:)+:|::)$/i;
const IP6_MIXED_REGEX = /(.*):((?:\d{1,3}\.|\*\.){3}(\d{1,3}|\*))$/;
function wildcardToNumber(max, radix = 10) {
    return (input) => {
        if (input === '*')
            return -1;
        const n = parseInt(input, radix);
        if (n < 0 || n > max) {
            throw new Error(`Value has to be in the range of 0-${max}`);
        }
        return n;
    };
}
/** `toBits(0b0010110101, 10)` would give `[0, 0, 1, 0, 1, 1, 0, 1, 0, 1]` */
function toBits(value, bits) {
    const result = [];
    while (bits--) {
        result[bits] = (value >> bits) & 1;
    }
    return result.reverse();
}
/** `fromBits([0, 0, 1, 0, 1, 1, 0, 1, 0, 1])` would give `0b0010110101` */
function fromBits(bits) {
    return bits.reduce((prev, bit) => {
        if (bit !== 0 && bit !== 1)
            throw new Error(`Expected 0 or 1 as bit but got '${bit}' instead`);
        return (prev << 1) | bit;
    });
}
/**
 * Converts a string to an IPMatch object. This correspondends either to
 * an IPv4, IPv4, IPRange or IPSubnetwork object, all extending the IPMatch class.
 * For ease-of-use, if the given input is an IPMatch object, that object itself is returned.
 * @param input - The input string to convert, or IPMatch object to return.
 * @returns Returns an IPMatch for the given string (or returns the given IPMatch itself)
 */
function getMatch(input) {
    if (input instanceof IPMatch)
        return input;
    let ip = getIP(`${input}`);
    if (ip)
        return ip;
    // Check if it's a range, aka `IP1-IP2` with IP1 and IP2 being both a IPv4 or both a IPv6.
    let split = input.split('-');
    if (split.length !== 1) {
        if (split.length !== 2)
            throw new Error('A range looks like \'IP-IP\'');
        const l = getIP(split[0]);
        if (!l || !l.exact())
            throw new Error('Left side of the IP range isn\'t a valid (exact) IP');
        const r = getIP(split[1]);
        if (!r || !r.exact())
            throw new Error('Right side of the IP range isn\'t a valid (exact) IP');
        if (l.type !== r.type)
            throw new Error('Expected same type of IP on both sides of range');
        return new IPRange(l, r);
    }
    // Check if it's a subnetwork, aka 'IP/mask' with IP being an IPv4/IPv6 and mask being a number.
    // The IPSubnetwork constructor will check if the mask is within range (1-32 for IPv4, 1-128 for IPv6)
    split = input.split('/');
    if (split.length !== 1) {
        ip = getIP(split[0]);
        if (!ip || !ip.exact())
            throw new Error('Expected a valid (exact) IP for a subnetwork');
        const bits = Number(split[1]);
        if (Number.isInteger(bits))
            return new IPSubnetwork(ip, bits);
        const mask = getIP(split[1]);
        if (mask)
            return new IPMask(ip, mask);
        throw new Error('A subnetwork or mask looks like \'IP/bits\' or \'IP/mask\' e.g. \'::1/64\' or \'::1/aa::\'');
    }
    throw new Error('Invalid IP (range/subnetwork)');
}
exports.getMatch = getMatch;
/** @internal Utility function to create cached functions */
function createCached(symbol, func) {
    return (value) => {
        if (symbol in value)
            return value[symbol];
        return value[symbol] = func(value);
    };
}
/** @internal Symbol to cache `convertToMasks` calls */
const SYM_CTMasks = Symbol('convertToMasks');
/** @internal Creates a wrapper around the given converter function to cache results */
function createCachedConvertToMasks(converter) {
    const cached = createCached(SYM_CTMasks, converter);
    // Doing it this way so that even though the underlying array is only calculated once, we
    // return a copy of it every invocation, so the user can freely modify the resulting array
    return obj => [...cached(obj)];
}
/** @internal Symbol to cache `convertToSubnet` calls */
const SYM_CTSubnet = Symbol('convertToSubnet');
/** @internal Symbol to cache `convertToSubnets` calls */
const SYM_CTSubnets = Symbol('convertToSubnets');
/**
 * Superclass of the IPv4, IPv6, IPRange and IPSubnetwork classes.
 * Only specifies a generic .matches() function and .type field.
 *
 * **Check the specific classes for more specialized methods/docs**
 * e.g. IPRange comes with `convertToSubnets`, IPv6 with `toLongString`, ...
 */
class IPMatch {
    /**
     * This used to be the generic way of converting a string to an IPRange/IPv4/... without assuming a type.
     * This class is now made abstract with a protected constructor, in favor of the new `getMatch(input)` function.
     * The abstract/deprecated/protected flag are to warn users about switching over to the new function.
     * With the way TypeScript compiles them to JavaScript, this constructor still works (thus compatible with old code)
     * @deprecated Use `getMatch(input: string)` instead.
     */
    constructor(input) {
        if (input == null)
            return this;
        return getMatch(input);
    }
}
exports.IPMatch = IPMatch;
/** Represents an IPv4 address, optionall with wildcards */
class IPv4 extends IPMatch {
    constructor(input) {
        super(null);
        this.type = 'IPv4';
        /** Field present on both IPv4 and IPv6 addresses indicating how many bits an address of that type has */
        this.bits = IPv4.bits;
        this.input = input.trim();
        const ip = input.match(IP4_REGEX);
        if (!ip)
            throw new Error('Invalid input for IPv4');
        this.parts = input.split('.').map(wildcardToNumber(255));
    }
    /**
     * Checks whether the given IP (or string to be first converted to an IP) matches this IPv4 object.
     * - If the given string represents an IPv6 address, this method returns false.
     * - In other cases, for an IPv4, we check if all 4 octets match.
     * - Octets that are wildcards in this object are always assumed to match.
     * - Octets that are wildcards in the input are **NOT** seen as a wildcard, e.g.
     *    `10.0.0.*` matches `10.0.0.3`, but the inverse would give false.
     */
    matches(ip) {
        let real;
        if (!(ip instanceof IPv4 || ip instanceof IPv6)) {
            real = getIP(ip);
        }
        else {
            real = ip;
        }
        if (!real)
            throw new Error('The given value is not a valid IP');
        if (!(real instanceof IPv4))
            return false;
        for (let i = 0; i < 4; i += 1) {
            const given = real.parts[i];
            const wanted = this.parts[i];
            if (wanted !== -1 && given !== wanted)
                return false;
        }
        return true;
    }
    equals(match) {
        return match instanceof IPv4 && match.parts.every((v, i) => this.parts[i] === v);
    }
    /** Returns whether this IPv4 is exact (aka contains no wildcards) */
    exact() {
        return !this.parts.includes(-1);
    }
    /**
     * Returns this IPv4 in dot-decimal/quat-dotted notation. Wildcards are represented as stars.
     * For example: `"10.*.0.*"`
     */
    toString() {
        return this.parts.map(v => v === -1 ? '*' : v).join('.');
    }
    convertToMasks() { return IPv4.convertToMasks(this); }
    getAmount() {
        return this.parts.reduce((t, p) => p === -1 ? t * 256 : t, 1);
    }
    /**
     * Returns the previous address, or undefined for `0.0.0.0`.
     * In case of a non-exact IP, the wildcard parts are ignored.
     * E.g. getPrevious for `10.0.*.0` returns `9.255.*.255`
     */
    getPrevious() {
        const newParts = [...this.parts];
        for (let i = newParts.length - 1; i >= 0; i--) {
            if (newParts[i] === 0) {
                newParts[i] = 255;
            }
            else if (newParts[i] !== -1) {
                newParts[i]--;
                return partsToIP(newParts);
            }
        }
        return undefined;
    }
    /**
     * Returns the next address, or undefined for `255.255.255.255`.
     * In case of a non-exact IP, the wildcard parts are ignored.
     * E.g. getNext for `10.0.*.255` returns `10.1.*.0`
     */
    getNext() {
        const newParts = [...this.parts];
        for (let i = newParts.length - 1; i >= 0; i--) {
            if (newParts[i] === 255) {
                newParts[i] = 0;
            }
            else if (newParts[i] !== -1) {
                newParts[i]++;
                return partsToIP(newParts);
            }
        }
        return undefined;
    }
    /** Converts this IP to an array of bits, e.g. `[1, 1, 0, 0, 0, ...]` for `192.0.0.0`. */
    toBits() {
        return this.parts.reduce((bits, part) => [...bits, ...toBits(part, 8)], []);
    }
    /** Converts an array of 32 bits to an IPv4, e.g. `192.0.0.0` for `[1, 1, 0, 0, 0, ...]` */
    static fromBits(bits) {
        if (bits.length !== 32)
            throw new Error('Expected 32 bits for IPv4.fromBits');
        return partsToIP([
            fromBits(bits.slice(0, 8)),
            fromBits(bits.slice(8, 16)),
            fromBits(bits.slice(16, 24)),
            fromBits(bits.slice(24, 32)),
        ]);
    }
}
exports.IPv4 = IPv4;
/** @internal */
IPv4.convertToMasks = createCachedConvertToMasks(ip => {
    if (ip.exact())
        return [new IPMask(ip, partsToIP(ip.parts.map(() => 255)))];
    const lower = partsToIP(ip.parts.map(v => v === -1 ? 0 : v));
    return [new IPMask(lower, partsToIP(ip.parts.map(v => v === -1 ? 0 : 255)))];
});
/** Field present on both IPv4 and IPv6 indicating how many bits an address of that type has */
IPv4.bits = 32;
const IP6_WTN = wildcardToNumber(0xFFFF, 16);
function shortenIPv6(address) {
    if (typeof address === 'string')
        address = new IPv6(address);
    if (address instanceof IPv6)
        address = address.toHextets();
    const score = [0, 0, 0, 0, 0, 0, 0, 0];
    const { length } = address;
    for (let i = 0; i < length; i += 1) {
        for (let j = i; j < length; j += 1) {
            if (address[j] === '0')
                score[i] += 1;
            else
                break;
        }
    }
    const best = score.reduce((prev, s, key) => s > score[prev] ? key : prev, 0);
    if (score[best]) {
        address.splice(best, score[best] - 1);
        address[best] = '';
    }
    // '::' results in address being ['']
    if (address.length === 1 && !address[0])
        return '::';
    return address.join(':').replace(/(^:|:$)/, '::');
}
/** Lazy wait-until-all-classes-are-available loading the ranges for mixed IPv6 formats, e.g. '::ffff:10.0.0.1' */
let MIXED_ADDRESS_RANGES = () => (MIXED_ADDRESS_RANGES = () => [
    getMatch('::ffff:*:*'),
    getMatch('::ffff:0:*:*'), // https://tools.ietf.org/html/draft-ietf-behave-translator-addressing-00#section-3.2.2
    // Also ::*:* but got deprecated, and would also conflict with e.g. ::1
])();
/** Represents an IPv6 address, optionall with wildcards */
class IPv6 extends IPMatch {
    constructor(input) {
        super(null);
        this.type = 'IPv6';
        /** Field present on both IPv4 and IPv6 addresses indicating how many bits an address of that type has */
        this.bits = IPv6.bits;
        this.input = input = input.trim();
        const mixed = input.match(IP6_MIXED_REGEX);
        if (mixed) {
            if (mixed[2].includes('*'))
                throw new Error('Mixed IPv6 address cannot contain wildcards in IPv4 part');
            const { parts: ipv4 } = new IPv4(mixed[2]);
            this.parts = [
                ...new IPv6(`${mixed[1]}:0:0`).parts.slice(0, 6),
                (ipv4[0] << 8) + ipv4[1], (ipv4[2] << 8) + ipv4[3],
            ];
            return;
        }
        if (!IP6_REGEX.test(input) && !IP6_MIXED_REGEX.test(input))
            throw new Error('Invalid input for IPv6');
        const sides = input.split('::');
        if (sides.length > 2)
            throw new Error('IPv6 addresses can only contain :: once');
        if (sides.length === 1) {
            this.parts = sides[0].split(':').map(IP6_WTN);
        }
        else {
            const l = sides[0] ? sides[0].split(':') : [];
            const r = sides[1] ? sides[1].split(':') : [];
            const t = 8 - l.length - r.length;
            if (t === 0)
                throw new Error('This IPv6 address doesn\'t need a ::');
            if (t < 1)
                throw new Error('Invalid amount of :');
            for (let i = 0; i < t; i += 1)
                l.push('0');
            this.parts = l.concat(r).map(IP6_WTN);
        }
    }
    /**
     * Checks whether the given IP (or string to be first converted to an IP) matches this IPv6 object.
     * - If the given string represents an IPv4 address, this method returns false.
     * - In other cases, for an IPv6, we check if all 8 hextets/hexadectets match.
     * - Octets that are wildcards in this object are always assumed to match.
     * - Octets that are wildcards in the input are **NOT** seen as a wildcard, e.g.
     *    `2001::abcd:*` matches `2001::abcd:1`, but the inverse would give false.
     */
    matches(ip) {
        let real;
        if (!(ip instanceof IPv4 || ip instanceof IPv6)) {
            real = getIP(ip);
        }
        else {
            real = ip;
        }
        if (!real)
            throw new Error('The given value is not a valid IP');
        if (!(real instanceof IPv6))
            return false;
        for (let i = 0; i < 8; i += 1) {
            const given = real.parts[i];
            const wanted = this.parts[i];
            if (wanted !== -1 && given !== wanted)
                return false;
        }
        return true;
    }
    equals(match) {
        return match instanceof IPv6 && match.parts.every((v, i) => this.parts[i] === v);
    }
    /** Returns whether this IPv4 is exact (aka contains no wildcards) */
    exact() {
        return !this.parts.includes(-1);
    }
    /** Returns an array with the 8 hextets of this address, or `"*"` for wildcard hextets */
    toHextets() {
        return this.parts.map(v => v === -1 ? '*' : v.toString(16));
    }
    /**
     * Returns the address in the full format, but with leading zeroes of hextets omitted.
     * Hextets representing wildcards will be shown as `"*"` instead.
     * Example result: `"2001:0:0:0:0:0:abc:1"`
     */
    toLongString() {
        return this.toHextets().join(':');
    }
    /**
     * Returns the address in the full format, but without omitting leading zeroes or hextets.
     * Hextets representing wildcards will be shown as `"*"` instead.
     * Example result: `"2001:0000:0000:0000:0000:0000:0abc:0001"`
     */
    toFullString() {
        return this.toHextets().map(v => v !== '*' && v.length < 4 ? `${'0'.repeat(4 - v.length)}${v}` : v).join(':');
    }
    /** Returns a mixed address (32 last bits representing an IPv4 address) in a mixed format e.g. "::ffff:c000:0280" as "::ffff:192.0.2.128" */
    toMixedString() {
        const { parts } = this;
        // Prepare the first part
        const hextets = parts.slice(0, 6).map(v => v === -1 ? '*' : v.toString(16));
        let shorten = shortenIPv6(hextets);
        if (shorten.endsWith('::'))
            shorten = shorten.substring(0, shorten.length - 1);
        // Prepare the second part
        const ipv4 = [
            parts[6] >> 8,
            parts[6] & 0xFF,
            parts[7] >> 8,
            parts[7] & 0xFF,
        ];
        if (parts[6] === -1)
            ipv4[0] = ipv4[1] = '*';
        if (parts[7] === -1)
            ipv4[2] = ipv4[3] = '*';
        // And slap them together
        return `${shorten}:${ipv4.join('.')}`;
    }
    /**
     * Returns the address in the shortest possible format, according to RFC 5952:
     * - All hexadecimal digits are lowercase (if applicable), as is the case with .toLongString(), toFullString(), ...
     * - Leading zeroes of each hextet are suppressed, apart from the all-zero field which is rendered as a single zero
     * - The (leftmost) longest sequence of multiple consecutive all-zero hextets is replaced with "::"
     * - If this address is known to be IPv4 mapped, it is displayed as such, which currently are for e.g. 127.0.0.1:
     *    - `"::ffff:127.0.0.1"`
     *    - `"::ffff:0:127.0.0.1"`
     */
    toString() {
        if (MIXED_ADDRESS_RANGES().some(m => m.matches(this)))
            return this.toMixedString();
        return shortenIPv6(this.toHextets());
    }
    convertToMasks() { return IPv6.convertToMasks(this); }
    getAmount() {
        return this.parts.reduce((t, p) => p === -1 ? t * 0x10000 : t, 1);
    }
    /**
     * Returns the previous address, or undefined for `::`.
     * In case of a non-exact IP, the wildcard parts are ignored.
     * E.g. getPrevious for `::5:*:0` returns `::4:*:ffff`
     */
    getPrevious() {
        const newParts = [...this.parts];
        for (let i = newParts.length - 1; i >= 0; i--) {
            if (newParts[i] === 0) {
                newParts[i] = 0xFFFF;
            }
            else if (newParts[i] !== -1) {
                newParts[i]--;
                return partsToIP(newParts);
            }
        }
        return undefined;
    }
    /**
     * Returns the next address, or undefined for `ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`.
     * In case of a non-exact IP, the wildcard parts are ignored.
     * E.g. getNext for `::0:*:ffff` returns `::1:*:0`
     */
    getNext() {
        const newParts = [...this.parts];
        for (let i = newParts.length - 1; i >= 0; i--) {
            if (newParts[i] === 0xFFFF) {
                newParts[i] = 0;
            }
            else if (newParts[i] !== -1) {
                newParts[i]++;
                return partsToIP(newParts);
            }
        }
        return undefined;
    }
    /** Converts this IP to an array of bits, e.g. `[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, ...]` for `f8::`. */
    toBits() {
        return this.parts.reduce((bits, part) => [...bits, ...toBits(part, 16)], []);
    }
    /** Converts an array of 128 bits to an IPv6, e.g. `f8::` for `[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, ...]` */
    static fromBits(bits) {
        if (bits.length !== 128)
            throw new Error('Expected 128 bits for IPv6.fromBits');
        const parts = [];
        for (let i = 0; i < 8; i++)
            parts[i] = fromBits(bits.slice(i * 16, (i + 1) * 16));
        return partsToIP(parts);
    }
}
exports.IPv6 = IPv6;
/** @internal */
IPv6.convertToMasks = createCachedConvertToMasks(ip => {
    if (ip.exact())
        return [new IPMask(ip, partsToIP(ip.parts.map(() => 0xffff)))];
    const lower = partsToIP(ip.parts.map(v => v === -1 ? 0 : v));
    return [new IPMask(lower, partsToIP(ip.parts.map(v => v === -1 ? 0 : 0xffff)))];
});
/** Field present on both IPv4 and IPv6 indicating how many bits an address of that type has */
IPv6.bits = 128;
/**
 * Tries to convert the given input string to an IP, aka an IPv4 or IPv6 object.
 * For ease-of-use, if the input is already an IPv4 or IPv6, it is returned.
 * @throws Errors if the given input format matches an IPv4/IPv6 address well enough, but is still invalid.
 */
function getIP(input) {
    if (input instanceof IPv4 || input instanceof IPv6)
        return input;
    input = input.trim();
    if (IP4_REGEX.test(input))
        return new IPv4(input);
    if (IP6_REGEX.test(input) || IP6_MIXED_REGEX.test(input))
        return new IPv6(input);
    return null;
}
exports.getIP = getIP;
/** @internal */
function partsToIP(parts) {
    if (parts.length !== 4 && parts.length !== 8)
        throw new Error(`Expected 4 or 8 parts, got ${parts.length} instead`);
    const ip = parts.length === 4 ? new IPv4('0.0.0.0') : new IPv6('::');
    Object.assign(ip, { parts });
    ip.input = ip.toString();
    return ip;
}
exports.partsToIP = partsToIP;
/** Represents a range of IP addresses, according to their numerical value */
class IPRange extends IPMatch {
    /** Both values should be the same type (IPv4 or IPv6) and `left` should be lower in numeric value than `right` */
    constructor(left, right) {
        super(null);
        this.left = left;
        this.right = right;
        this.type = 'IPRange';
        if (left.type !== right.type)
            throw new Error('Expected same type of IP on both sides of range');
        if (!this.isLowerOrEqual(left, right))
            throw new Error('Left side of range should be lower than right side');
        this.input = left + '-' + right;
    }
    /** Checks whether the given IP lies in the range defined by the two bounds (inclusive) */
    matches(ip) {
        let real;
        if (!(ip instanceof IPv4 || ip instanceof IPv6)) {
            real = getIP(ip);
        }
        else {
            real = ip;
        }
        if (!real)
            throw new Error('The given value is not a valid IP');
        // While we originally threw an error here, this seems counter-intuitive and is unlike all other implementations
        if (real.type !== this.left.type)
            return false;
        return this.isLowerOrEqual(this.left, real) && this.isLowerOrEqual(real, this.right);
    }
    equals(match) {
        return match instanceof IPRange && match.left.equals(this.left) && match.right.equals(this.right);
    }
    /** Converts this IPRange to a string, by joining the two bounds with a dash, e.g. "IP1-IP2" */
    toString() {
        return this.input;
    }
    /** Converts this IPRange to an optimized list of (CIDR) IPSubnetworks */
    convertToSubnets() { return [...IPRange.convertToSubnets(this)]; }
    convertToMasks() { return IPRange.convertToMasks(this); }
    getAmount() {
        const lParts = this.left.parts;
        const rParts = [...this.right.parts];
        const maxPart = 2 ** (this.left.bits / lParts.length);
        for (let i = 0; i < rParts.length; i++) {
            let v = rParts[i] - lParts[i];
            if (v < 0) {
                v += maxPart;
                rParts[i - 1] -= 1;
            }
            rParts[i] = v;
        }
        return rParts.reduce((t, s) => (t * maxPart) + s, 0) + 1;
    }
    /** Returns the first IP address in this range */
    getFirst() { return this.left; }
    /** Returns the last IP address in this range */
    getLast() { return this.right; }
    isLowerOrEqual(left, right) {
        const l = left.parts;
        const r = right.parts;
        for (let i = 0; i < l.length; i += 1) {
            const L = l[i];
            const R = r[i];
            if (L === R)
                continue;
            if (L < R)
                return true;
            if (L > R)
                return false;
        }
        return true;
    }
}
exports.IPRange = IPRange;
/** @internal */
IPRange.convertToSubnets = createCached(SYM_CTSubnets, range => {
    const result = [];
    const { left, right } = range;
    const maxBits = left.bits;
    const rBits = right.toBits();
    let current = left;
    while (current && range.isLowerOrEqual(current, right)) {
        const cBits = current.toBits();
        let hostBits = 0;
        for (let i = cBits.length - 1; i >= 0; i--)
            if (cBits[i])
                break;
            else
                hostBits++;
        let maxHostBits = 0;
        for (let i = 0; i < cBits.length; i++) {
            if (cBits[i] === rBits[i])
                maxHostBits++;
            else
                break;
        }
        maxHostBits = maxBits - maxHostBits;
        let trailingOnes = 0;
        for (let i = rBits.length - 1; i >= 0; i--)
            if (rBits[i])
                trailingOnes++;
            else
                break;
        if (trailingOnes < maxHostBits)
            maxHostBits--;
        const prefixLength = maxBits - Math.min(hostBits, maxHostBits);
        const subnet = new IPSubnetwork(current, prefixLength);
        result.push(subnet);
        current = subnet.getLast().getNext();
    }
    return result;
});
/** @internal */
IPRange.convertToMasks = createCachedConvertToMasks(range => range.convertToSubnets().reduce((r, subnet) => [...r, ...subnet.convertToMasks()], []));
function getLowerPart(part, bits, max) {
    if (bits > max)
        bits = max;
    return part & (Math.pow(2, max) - Math.pow(2, max - bits));
}
function getUpperPart(part, bits, max) {
    if (bits > max)
        bits = max;
    return part | (Math.pow(2, max - bits) - 1);
}
/** Represents a subnetwork. The combination of an IP and a (simple) mask. A simplified version of IPMask. */
class IPSubnetwork extends IPMatch {
    /** Bits has to be in the range 0-32 for IPv4 and 0-128 for IPv6 */
    constructor(ip, bits) {
        super(null);
        this.bits = bits;
        this.type = 'IPSubnetwork';
        if (bits < 0 || bits > ip.bits) {
            throw new Error(`A ${ip.type} subnetwork's bits should be in the range of 1-${ip.bits}, got ${bits} instead`);
        }
        let lower = new (ip.constructor)(ip.input);
        let upper = new (ip.constructor)(ip.input);
        const bitsPerPart = ip.bits / ip.parts.length;
        for (let i = 0; i < ip.parts.length; i += 1) {
            lower.parts[i] = getLowerPart(ip.parts[i], bits, bitsPerPart);
            upper.parts[i] = getUpperPart(lower.parts[i], bits, bitsPerPart);
            bits = bits <= bitsPerPart ? 0 : bits - bitsPerPart;
        }
        lower = new (ip.constructor)(lower.toString());
        upper = new (ip.constructor)(upper.toString());
        this.range = new IPRange(lower, upper);
        this.input = `${lower}/${this.bits}`;
    }
    /** Checks whether the given IP lies in this subnetwork */
    matches(ip) {
        return this.range.matches(ip);
    }
    equals(match) {
        return match instanceof IPSubnetwork && match.range.equals(this.range);
    }
    /** Converts this IPSubnetwork to a string in CIDR representation, e.g. "IP/mask" */
    toString() {
        return this.input;
    }
    convertToMasks() { return IPSubnetwork.convertToMasks(this); }
    getAmount() {
        return 2 ** (this.range.left.bits - this.bits);
    }
    /** Returns the first IP address in this range */
    getFirst() { return this.range.left; }
    /** Returns the last IP address in this range */
    getLast() { return this.range.right; }
}
exports.IPSubnetwork = IPSubnetwork;
/** @internal */
IPSubnetwork.convertToMasks = createCachedConvertToMasks(subnet => {
    const { left } = subnet.range;
    const parts = [];
    const bitsPerPart = left.bits / left.parts.length;
    const max_part = (2 ** bitsPerPart) - 1;
    let { bits } = subnet;
    while (bits > 0) {
        const adding = bits > bitsPerPart ? bitsPerPart : bits;
        const neg = bitsPerPart - adding;
        parts.push((max_part >> neg) << neg);
        bits = bits - adding;
    }
    for (let i = parts.length, max = left.parts.length; i < max; i++)
        parts[i] = 0;
    return [new IPMask(subnet.range.left, partsToIP(parts))];
});
/** Represents an IP mask. The combination of an IP and a mask. A more complex version of IPSubnetwork. */
class IPMask extends IPMatch {
    constructor(ip, mask) {
        super(null);
        this.ip = ip;
        this.mask = mask;
        this.type = 'IPMask';
        if (!ip.exact())
            throw new Error(`Base IP of the IPMask isn't a valid (exact) IP`);
        if (!mask.exact())
            throw new Error(`Mask IP of the IPMask isn't a valid (exact) IP`);
        if (ip.type !== mask.type)
            throw new Error('Expected same type of IP as base IP and mask IP to construct the mask');
        const lower = new (ip.constructor)(ip.input);
        const maskParts = mask.parts;
        lower.parts.forEach((p, i) => lower.parts[i] = p & maskParts[i]);
        this.ip = lower;
        this.input = `${lower}/${mask}`;
    }
    /** Checks whether the given IP matches this mask */
    matches(ip) {
        const real = getIP(ip);
        if (!real)
            throw new Error('The given value is not a valid IP');
        if (real.type !== this.ip.type)
            return false;
        const { ip: { parts: ipParts }, mask: { parts: maskParts } } = this;
        return real.parts.every((p, i) => (p & maskParts[i]) === ipParts[i]);
    }
    equals(match) {
        return match instanceof IPMask && match.ip.equals(this.ip) && match.mask.equals(this.mask);
    }
    /**
     * Converts this IPMask to a string, by joining the IP and mask with a slash, e.g. "IP/mask".
     * Does simplify the IP and mask in their IP form, but does not simplify e.g. `10.0.0.0/255.0.0.0` to `10.0.0.0/8`.
     */
    toString() {
        return this.input;
    }
    /**
     * Tries to convert this IPMask to an IPSubnetwork. This only works if this mask is a "proper" subnet mask.
     * In other words, the bits have to be sequential. `255.255.128.0` is valid, `255.255.63.0` is not.
     * When this is not the case, `undefined` is returned instead.
     */
    convertToSubnet() { return IPMask.convertToSubnet(this); }
    convertToMasks() { return [this]; }
    getAmount() {
        return this.mask.toBits().reduce((p, b) => b ? p : (p + p), 1);
    }
    /**
     * Returns whether this mask is a subset of the given mask. In other words, all IP addresses matched
     * by this mask should also be matched by the given mask, although the given mask can match others too.
     * @throws Throws an error if the IP address types mismatch (e.g. this mask is for IPv4 but the given is IPv6)
     */
    isSubsetOf(mask) {
        if (this.ip.type !== mask.ip.type)
            throw new Error('Expected same type of masks (e.g. all IPv4 or all IPv6)');
        if (this.equals(mask))
            return true;
        if (this.getAmount() > mask.getAmount())
            return false;
        const iBitsA = this.ip.toBits();
        const mBitsA = this.mask.toBits();
        const iBitsB = mask.ip.toBits();
        const mBitsB = mask.mask.toBits();
        for (let i = 0; i < iBitsA.length; i++) {
            if (!mBitsB[i])
                continue; // mask B matches every bit
            if (!mBitsA[i])
                return false; // mask A matches every bit, mask B doesn't
            if (iBitsA[i] !== iBitsB[i])
                return false; // both masks expect different bits
        }
        return true;
    }
}
exports.IPMask = IPMask;
/** @internal */
IPMask.convertToSubnet = createCached(SYM_CTSubnet, ({ ip, mask }) => {
    const bitsPerPart = ip.bits / ip.parts.length;
    const maxPart = (2 ** bitsPerPart) - 1;
    let prefix = 0;
    let partial = false;
    for (const part of mask.parts) {
        if (partial && part) {
            return undefined;
        }
        else if (part === maxPart) {
            prefix += bitsPerPart;
        }
        else if (part) {
            for (let i = bitsPerPart - 1; i >= 0; i--) {
                const b = (part >> i) & 1;
                if (partial && b) {
                    return undefined;
                }
                else if (b) {
                    prefix++;
                }
                else {
                    partial = true;
                }
            }
        }
        else {
            partial = true;
        }
    }
    return new IPSubnetwork(ip, prefix);
});
//# sourceMappingURL=ip.js.map