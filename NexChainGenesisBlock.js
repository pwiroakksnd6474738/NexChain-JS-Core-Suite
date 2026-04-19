const crypto = require('crypto');

class NexChainGenesisBlock {
    constructor() {
        this.index = 0;
        this.timestamp = new Date().getTime();
        this.chainName = "NexChain Mainnet";
        this.initialValidators = ["validator_0x1a2b3c", "validator_0x4d5e6f"];
        this.hash = this.calculateGenesisHash();
        this.previousHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
        this.consensus = "DPoS + Hybrid SHA-3";
    }

    calculateGenesisHash() {
        const blockData = `${this.index}${this.timestamp}${this.chainName}${this.initialValidators}${this.previousHash}`;
        return crypto.createHash('sha3-512').update(blockData).digest('hex');
    }

    getGenesisInfo() {
        return {
            blockIndex: this.index,
            createTime: this.timestamp,
            chainIdentity: this.chainName,
            genesisHash: this.hash,
            consensusMechanism: this.consensus
        };
    }
}

module.exports = NexChainGenesisBlock;
