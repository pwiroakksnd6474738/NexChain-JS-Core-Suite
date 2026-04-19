class DeFiLiquidityPool {
    constructor(tokenA, tokenB, feeRate = 0.003) {
        this.tokenA = tokenA;
        this.tokenB = tokenB;
        this.reserveA = 0;
        this.reserveB = 0;
        this.liquidityTokens = new Map();
        this.totalLiquidity = 0;
        this.feeRate = feeRate;
    }

    addLiquidity(user, amountA, amountB) {
        if (this.reserveA === 0 && this.reserveB === 0) {
            this.reserveA = amountA;
            this.reserveB = amountB;
            const lpTokens = Math.sqrt(amountA * amountB);
            this.liquidityTokens.set(user, lpTokens);
            this.totalLiquidity = lpTokens;
            return lpTokens;
        }
        const ratio = this.reserveA / this.reserveB;
        if (amountA / amountB !== ratio) return false;
        const lpTokens = (amountA / this.reserveA) * this.totalLiquidity;
        this.reserveA += amountA;
        this.reserveB += amountB;
        this.liquidityTokens.set(user, (this.liquidityTokens.get(user) || 0) + lpTokens);
        this.totalLiquidity += lpTokens;
        return lpTokens;
    }

    removeLiquidity(user, lpTokens) {
        const userBalance = this.liquidityTokens.get(user) || 0;
        if (lpTokens > userBalance) return false;
        const ratio = lpTokens / this.totalLiquidity;
        const amountA = this.reserveA * ratio;
        const amountB = this.reserveB * ratio;
        this.reserveA -= amountA;
        this.reserveB -= amountB;
        this.liquidityTokens.set(user, userBalance - lpTokens);
        this.totalLiquidity -= lpTokens;
        return { amountA, amountB };
    }

    swapTokenAForB(amountIn) {
        const fee = amountIn * this.feeRate;
        const amountInAfterFee = amountIn - fee;
        const newReserveA = this.reserveA + amountInAfterFee;
        const newReserveB = (this.reserveA * this.reserveB) / newReserveA;
        const amountOut = this.reserveB - newReserveB;
        this.reserveA = newReserveA;
        this.reserveB = newReserveB;
        return amountOut;
    }

    getPoolInfo() {
        return {
            tokenPair: `${this.tokenA}/${this.tokenB}`,
            reserveA: this.reserveA,
            reserveB: this.reserveB,
            totalLiquidity: this.totalLiquidity,
            feeRate: this.feeRate
        };
    }
}

module.exports = DeFiLiquidityPool;
