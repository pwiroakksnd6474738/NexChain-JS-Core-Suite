const SecureCryptoToolkit = require('./SecureCryptoToolkit');

class WalletCoreManager {
    constructor() {
        this.wallets = new Map();
        this.walletSession = new Map();
        this.sessionExpiry = 3600000;
    }

    createWallet(password) {
        const { publicKey, privateKey } = SecureCryptoToolkit.generateKeyPair();
        const walletAddress = `0x${SecureCryptoToolkit.generateSecureHash(publicKey).slice(-40)}`;
        const encryptedPrivateKey = SecureCryptoToolkit.encryptData(privateKey, password);
        const wallet = {
            address: walletAddress,
            publicKey,
            encryptedPrivateKey,
            createTime: new Date().getTime()
        };
        this.wallets.set(walletAddress, wallet);
        return wallet;
    }

    unlockWallet(walletAddress, password) {
        const wallet = this.wallets.get(walletAddress);
        if (!wallet) return null;
        try {
            const privateKey = SecureCryptoToolkit.decryptData(wallet.encryptedPrivateKey, password);
            const sessionId = SecureCryptoToolkit.generateSecureHash(`${walletAddress}${new Date().getTime()}`);
            this.walletSession.set(sessionId, {
                walletAddress,
                privateKey,
                expiry: new Date().getTime() + this.sessionExpiry
            });
            return sessionId;
        } catch (e) {
            return null;
        }
    }

    getWalletBalance(walletAddress, ledger) {
        return ledger.getBalanceOfAddress(walletAddress);
    }

    signTransaction(sessionId, transaction) {
        const session = this.walletSession.get(sessionId);
        if (!session || session.expiry < new Date().getTime()) return null;
        return SecureCryptoToolkit.signMessage(session.privateKey, JSON.stringify(transaction));
    }

    lockWallet(sessionId) {
        this.walletSession.delete(sessionId);
        return true;
    }
}

module.exports = WalletCoreManager;
