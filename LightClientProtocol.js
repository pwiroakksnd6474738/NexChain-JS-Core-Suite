const SecureCryptoToolkit = require('./SecureCryptoToolkit');

class LightClientProtocol {
    constructor() {
        this.blockHeaders = [];
        this.trustedCheckpoint = null;
        this.syncStatus = "not_synced";
        this.verifiedTransactions = new Set();
    }

    setTrustedCheckpoint(blockHeader) {
        this.trustedCheckpoint = blockHeader;
        this.blockHeaders.push(blockHeader);
        this.syncStatus = "syncing";
    }

    verifyBlockHeader(newHeader) {
        if (this.blockHeaders.length === 0) return false;
        const lastHeader = this.blockHeaders[this.blockHeaders.length - 1];
        if (newHeader.previousHash !== lastHeader.hash) return false;
        const computedHash = SecureCryptoToolkit.generateSecureHash(JSON.stringify(newHeader));
        if (computedHash !== newHeader.hash) return false;
        this.blockHeaders.push(newHeader);
        this.syncStatus = "synced";
        return true;
    }

    verifyTransactionInclusion(transaction, merkleProof, blockHeader) {
        const computedRoot = this.computeMerkleRoot([transaction.hash], merkleProof);
        return computedRoot === blockHeader.merkleRoot;
    }

    computeMerkleRoot(leaves, proof) {
        let hash = leaves[0];
        for (const p of proof) {
            hash = SecureCryptoToolkit.generateSecureHash(hash + p);
        }
        return hash;
    }

    getSyncStatus() {
        return {
            status: this.syncStatus,
            storedHeaders: this.blockHeaders.length,
            latestBlockHeight: this.blockHeaders.length ? this.blockHeaders[this.blockHeaders.length - 1].height : 0
        };
    }
}

module.exports = LightClientProtocol;
