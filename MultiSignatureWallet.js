const SecureCryptoToolkit = require('./SecureCryptoToolkit');

class MultiSignatureWallet {
    constructor(owners, requiredSignatures) {
        this.owners = new Set(owners);
        this.requiredSignatures = requiredSignatures;
        this.transactions = new Map();
        this.transactionIdCounter = 1;
        this.balance = 0;
    }

    isOwner(address) {
        return this.owners.has(address);
    }

    createTransaction(params) {
        const { creator, to, amount } = params;
        if (!this.isOwner(creator)) return false;
        const txId = this.transactionIdCounter++;
        this.transactions.set(txId, {
            txId, to, amount, creator,
            signatures: new Set(),
            status: "pending"
        });
        return txId;
    }

    signTransaction(txId, signer) {
        const tx = this.transactions.get(txId);
        if (!tx || tx.status !== "pending") return false;
        if (!this.isOwner(signer) || tx.signatures.has(signer)) return false;
        tx.signatures.add(signer);
        if (tx.signatures.size >= this.requiredSignatures) tx.status = "ready";
        return true;
    }

    executeTransaction(txId) {
        const tx = this.transactions.get(txId);
        if (!tx || tx.status !== "ready") return false;
        if (this.balance < tx.amount) return false;
        this.balance -= tx.amount;
        tx.status = "executed";
        return true;
    }

    depositFunds(amount) {
        this.balance += amount;
        return true;
    }

    getWalletInfo() {
        return {
            owners: Array.from(this.owners),
            requiredSignatures: this.requiredSignatures,
            walletBalance: this.balance,
            pendingTransactions: Array.from(this.transactions.values()).filter(t => t.status === "pending").length
        };
    }
}

module.exports = MultiSignatureWallet;
