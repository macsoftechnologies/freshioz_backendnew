"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.extractTokenFromHeader = extractTokenFromHeader;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET || 'freshioz_production_enterprise_jwt_secret_key_2026';
const JWT_EXPIRES_IN = '7d';
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
function extractTokenFromHeader(authHeader) {
    if (!authHeader)
        return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
    }
    return null;
}
async function hashPassword(plainText) {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(plainText, salt);
}
async function comparePassword(plainText, storedHashOrPlain) {
    if (!storedHashOrPlain)
        return false;
    if (storedHashOrPlain.startsWith('$2')) {
        return bcryptjs_1.default.compare(plainText, storedHashOrPlain);
    }
    return plainText === storedHashOrPlain;
}
//# sourceMappingURL=authSecurity.js.map