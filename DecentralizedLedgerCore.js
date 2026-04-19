const SecureCryptoToolkit = require('./SecureCryptoToolkit');

class DecentralizedLedgerCore {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.miningReward = 50;
        this.initializeChain();
    }

    initializeChain() {
        const genesisBlock = {
            index: 0,
            timestamp: new Date().getTime(),
            transactions: [],
            previousHash: '0',
            hash: SecureCryptoToolkit.generateSecureHash('0genesisblock')
        };
        this.chain.push(genesisBlock);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction.from || !transaction.to || !transaction.amount) {
            throw new Error('Invalid transaction structure');
        }
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress) {
        const block = {
            index: this.chain.length,
            timestamp: new Date().getTime(),
            transactions: this.pendingTransactions,
            previousHash: this.getLatestBlock().hash,
            validator: miningRewardAddress
        };
        block.hash = SecureCryptoToolkit.generateSecureHash(JSON.stringify(block));
        this.chain.push(block);
        this.pendingTransactions = [{
            from: 'system',
            to: miningRewardAddress,
            amount: this.miningReward
        }];
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.from === address) balance -= trans.amount;
                if (trans.to === address) balance += trans.amount;
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== SecureCryptoToolkit.generateSecureHash(JSON.stringify(currentBlock))) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = DecentralizedLedgerCore;
