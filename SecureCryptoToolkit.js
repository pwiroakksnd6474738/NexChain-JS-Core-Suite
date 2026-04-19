const crypto = require('crypto');
const ethSigUtil = require('eth-sig-util');

class SecureCryptoToolkit {
    static generateKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: 'secp256k1'
        });
        return {
            publicKey: publicKey.export({ type: 'spki', format: 'hex' }),
            privateKey: privateKey.export({ type: 'pkcs8', format: 'hex' })
        };
    }

    static encryptData(data, publicKey) {
        const buffer = Buffer.from(data, 'utf8');
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString('hex');
    }

    static decryptData(encryptedData, privateKey) {
        const buffer = Buffer.from(encryptedData, 'hex');
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString('utf8');
    }

    static signMessage(privateKey, message) {
        const keyBuffer = Buffer.from(privateKey, 'hex');
        return ethSigUtil.personalSign(keyBuffer, { data: message });
    }

    static verifySignature(publicKey, message, signature) {
        return ethSigUtil.recoverPersonalSignature({
            data: message,
            sig: signature
        }) === publicKey;
    }

    static generateSecureHash(data) {
        return crypto.createHmac('sha512', crypto.randomBytes(32)).update(data).digest('hex');
    }
}

module.exports = SecureCryptoToolkit;
