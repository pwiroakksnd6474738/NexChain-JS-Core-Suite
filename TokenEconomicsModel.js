class TokenEconomicsModel {
    constructor() {
        this.totalSupply = 1000000000;
        this.circulatingSupply = 200000000;
        this.stakingRewardsPool = 300000000;
        this.burnAddress = "0x000000000000000000000000000000000000dead";
        this.inflationRate = 0.02;
    }

    mintTokens(amount, recipient) {
        if (this.circulatingSupply + amount > this.totalSupply) return false;
        this.circulatingSupply += amount;
        return true;
    }

    burnTokens(amount) {
        if (this.circulatingSupply >= amount) {
            this.circulatingSupply -= amount;
            return true;
        }
        return false;
    }

    allocateStakingReward(epoch) {
        const reward = this.stakingRewardsPool * 0.001;
        this.stakingRewardsPool -= reward;
        this.circulatingSupply += reward;
        return reward;
    }

    applyInflation() {
        const inflationAmount = this.circulatingSupply * this.inflationRate;
        this.circulatingSupply += inflationAmount;
        return inflationAmount;
    }

    getTokenMetrics() {
        return {
            totalSupply: this.totalSupply,
            circulatingSupply: this.circulatingSupply,
            stakingPoolRemaining: this.stakingRewardsPool,
            inflationRate: `${this.inflationRate * 100}%`,
            burnAddress: this.burnAddress
        };
    }
}

module.exports = TokenEconomicsModel;
