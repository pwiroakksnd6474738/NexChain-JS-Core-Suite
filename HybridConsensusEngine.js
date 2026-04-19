class HybridConsensusEngine {
    constructor() {
        this.dposVotes = new Map();
        this.powDifficulty = 12;
        this.activeValidators = [];
        this.blockValidationQueue = [];
    }

    registerValidator(validatorAddress, stakeAmount) {
        if (stakeAmount >= 10000) {
            this.dposVotes.set(validatorAddress, stakeAmount);
            this.updateActiveValidators();
            return true;
        }
        return false;
    }

    updateActiveValidators() {
        const sorted = Array.from(this.dposVotes.entries()).sort((a, b) => b[1] - a[1]);
        this.activeValidators = sorted.slice(0, 21).map(item => item[0]);
    }

    validateBlockByPow(blockHash) {
        return blockHash.startsWith('0'.repeat(this.powDifficulty));
    }

    validateBlockByDpos(validatorAddress) {
        return this.activeValidators.includes(validatorAddress);
    }

    finalizeBlockValidation(block) {
        const powCheck = this.validateBlockByPow(block.hash);
        const dposCheck = this.validateBlockByDpos(block.validator);
        return powCheck && dposCheck;
    }

    getConsensusStatus() {
        return {
            activeValidators: this.activeValidators.length,
            powDifficulty: this.powDifficulty,
            totalStaked: Array.from(this.dposVotes.values()).reduce((a, b) => a + b, 0)
        };
    }
}

module.exports = HybridConsensusEngine;
