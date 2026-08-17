const crypto = require("crypto");

// Generate a valid 32-byte key (Use any random 32-character key)
const secretKey = Buffer.from('i1vnI4QJk0LJoIhJkAuAz6hQOOJcgAPm', 'utf-8');
const algorithm = 'aes-256-cbc';
const iv = Buffer.from('1234567890123456'); // 16 bytes IV

function decryptApiKey(apiKey) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(apiKey, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

// Encrypt Function
function encryptCompCode(compCode) {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(compCode, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
// const compCode = 'AMAR';
// const apiKey = encryptCompCode(compCode);
// console.log('AMAR',apiKey);

// Export the functions
module.exports = { encryptCompCode, decryptApiKey };
