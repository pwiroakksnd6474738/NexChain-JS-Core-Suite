class CrossChainBridgeCore {
    constructor() {
        this.supportedChains = ["ETH", "BSC", "SOL", "NEXCHAIN"];
        this.bridgeTransactions = new Map();
        this.lockedAssets = new Map();
        this.bridgeFee = 0.005;
    }

    initiateBridgeTransfer(params) {
        const { fromChain, toChain, asset, amount, sender, recipient } = params;
        if (!this.supportedChains.includes(fromChain) || !this.supportedChains.includes(toChain)) {
            return { success: false, message: "Unsupported chain" };
        }
        const txId = this.generateTxId();
        const fee = amount * this.bridgeFee;
        const transferAmount = amount - fee;
        const bridgeTx = {
            txId, fromChain, toChain, asset, amount, transferAmount, fee, sender, recipient,
            status: "pending", timestamp: new Date().getTime()
        };
        this.bridgeTransactions.set(txId, bridgeTx);
        this.lockAsset(fromChain, asset, amount);
        return { success: true, txId };
    }

    generateTxId() {
        return Math.random().toString(16).substring(2, 18).toUpperCase();
    }

    lockAsset(chain, asset, amount) {
        const key = `${chain}-${asset}`;
        this.lockedAssets.set(key, (this.lockedAssets.get(key) || 0) + amount);
    }

    unlockAsset(chain, asset, amount) {
        const key = `${chain}-${asset}`;
        const current = this.lockedAssets.get(key) || 0;
        if (current >= amount) {
            this.lockedAssets.set(key, current - amount);
            return true;
        }
        return false;
    }

    completeBridgeTransfer(txId) {
        const tx = this.bridgeTransactions.get(txId);
        if (!tx || tx.status !== "pending") return false;
        tx.status = "completed";
        this.unlockAsset(tx.toChain, tx.asset, tx.transferAmount);
        return true;
    }

    getBridgeStatus(txId) {
        return this.bridgeTransactions.get(txId) || null;
    }
}

module.exports = CrossChainBridgeCore;
