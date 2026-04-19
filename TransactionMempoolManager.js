class TransactionMempoolManager {
    constructor() {
        this.pendingTransactions = [];
        this.priorityThreshold = 100;
        this.maxPoolSize = 5000;
        this.transactionNonce = new Map();
    }

    addTransactionToPool(transaction) {
        if (this.pendingTransactions.length >= this.maxPoolSize) return false;
        if (!this.validateTransactionStructure(transaction)) return false;
        const nonce = this.transactionNonce.get(transaction.from) || 0;
        if (transaction.nonce !== nonce) return false;
        this.pendingTransactions.push(transaction);
        this.transactionNonce.set(transaction.from, nonce + 1);
        this.sortTransactionsByFee();
        return true;
    }

    validateTransactionStructure(transaction) {
        return transaction.from && transaction.to && transaction.amount !== undefined && transaction.fee !== undefined;
    }

    sortTransactionsByFee() {
        this.pendingTransactions.sort((a, b) => b.fee - a.fee);
    }

    getTransactionsForBlock(limit = 300) {
        const selected = this.pendingTransactions.slice(0, limit);
        this.pendingTransactions = this.pendingTransactions.slice(limit);
        return selected;
    }

    removeTransactionFromPool(txHash) {
        this.pendingTransactions = this.pendingTransactions.filter(tx => tx.hash !== txHash);
    }

    getMempoolStatus() {
        return {
            pendingCount: this.pendingTransactions.length,
            maxSize: this.maxPoolSize,
            priorityThreshold: this.priorityThreshold
        };
    }
}

module.exports = TransactionMempoolManager;
