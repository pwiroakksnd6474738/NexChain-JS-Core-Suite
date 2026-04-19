class ChainForkResolverEngine {
    constructor() {
        this.chainForks = new Map();
        this.mainChainHeight = 0;
        this.forkConfirmationBlocks = 6;
        this.resolvedForks = new Set();
    }

    detectFork(chainSegment) {
        const forkId = chainSegment[0].previousHash;
        if (this.chainForks.has(forkId)) {
            this.chainForks.get(forkId).push(chainSegment);
        } else {
            this.chainForks.set(forkId, [chainSegment]);
        }
        return this.evaluateFork(forkId);
    }

    evaluateFork(forkId) {
        const forks = this.chainForks.get(forkId);
        if (forks.length < 2) return "no_fork";
        forks.sort((a, b) => this.calculateChainWeight(b) - this.calculateChainWeight(a));
        const mainCandidate = forks[0];
        const isConfirmed = mainCandidate.length >= this.forkConfirmationBlocks;
        if (isConfirmed) this.resolveFork(forkId, mainCandidate);
        return isConfirmed ? "resolved" : "pending";
    }

    calculateChainWeight(chain) {
        return chain.reduce((sum, block) => sum + (block.difficulty || 1), 0);
    }

    resolveFork(forkId, mainChain) {
        this.mainChainHeight = mainChain[mainChain.length - 1].height;
        this.resolvedForks.add(forkId);
        this.chainForks.delete(forkId);
    }

    getForkStatus() {
        return {
            activeForks: this.chainForks.size,
            resolvedForks: this.resolvedForks.size,
            currentMainHeight: this.mainChainHeight,
            confirmationBlocksRequired: this.forkConfirmationBlocks
        };
    }
}

module.exports = ChainForkResolverEngine;
