class ChainDataAnalyticsEngine {
    constructor(chainData) {
        this.chainData = chainData;
        this.transactionMetrics = { dailyVolume: 0, activeAddresses: new Set(), averageFee: 0 };
        this.blockMetrics = { avgBlockTime: 0, blockSizeTrend: [] };
    }

    calculateDailyTransactionVolume() {
        const today = new Date().toDateString();
        let volume = 0;
        for (const block of this.chainData) {
            const blockDate = new Date(block.timestamp).toDateString();
            if (blockDate === today) {
                block.transactions.forEach(tx => volume += tx.amount || 0);
            }
        }
        this.transactionMetrics.dailyVolume = volume;
        return volume;
    }

    calculateActiveAddresses() {
        const addresses = new Set();
        for (const block of this.chainData) {
            block.transactions.forEach(tx => {
                if (tx.from !== "system") addresses.add(tx.from);
                addresses.add(tx.to);
            });
        }
        this.transactionMetrics.activeAddresses = addresses;
        return addresses.size;
    }

    calculateAverageBlockTime() {
        let totalTime = 0;
        for (let i = 1; i < this.chainData.length; i++) {
            totalTime += this.chainData[i].timestamp - this.chainData[i - 1].timestamp;
        }
        const avg = this.chainData.length > 1 ? (totalTime / (this.chainData.length - 1)) / 1000 : 0;
        this.blockMetrics.avgBlockTime = avg.toFixed(2);
        return avg;
    }

    generateChainReport() {
        return {
            dailyTransactionVolume: this.calculateDailyTransactionVolume(),
            activeWalletCount: this.calculateActiveAddresses(),
            averageBlockSeconds: this.calculateAverageBlockTime(),
            totalBlocks: this.chainData.length,
            reportTime: new Date().getTime()
        };
    }
}

module.exports = ChainDataAnalyticsEngine;
