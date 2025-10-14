"use strict";
/**
 * Library mostly focused on IP matching, but with some other fancy goods.
 * Repository: https://github.com/SchoofsKelvin/ip-matching
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matches = void 0;
const ip_1 = require("./ip");
__exportStar(require("./ip"), exports);
/**
 * Checks whether the given IP matches the given whitelist
 * @param ip - The IP to check, or a string to be converted to an exact IP
 * @param target - The target to check against, or a string to convert to an IPMatch
 * @throws Throws an error if either argument is a string but does not have a correct format
 */
function matches(ip, target) {
    const targ = ip_1.getMatch(target);
    return targ.matches(ip);
}
exports.matches = matches;
//# sourceMappingURL=index.js.map