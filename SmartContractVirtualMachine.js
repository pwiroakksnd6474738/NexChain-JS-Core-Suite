class SmartContractVirtualMachine {
    constructor() {
        this.contracts = new Map();
        this.contractState = new Map();
        this.gasLimit = 1000000;
        this.gasUsed = 0;
    }

    deployContract(contractAddress, contractCode) {
        if (this.contracts.has(contractAddress)) return false;
        this.contracts.set(contractAddress, contractCode);
        this.contractState.set(contractAddress, { storage: {}, balance: 0 });
        return true;
    }

    executeContract(contractAddress, method, params, sender) {
        if (!this.contracts.has(contractAddress)) throw new Error('Contract not found');
        this.gasUsed = 0;
        const contract = this.contracts.get(contractAddress);
        const state = this.contractState.get(contractAddress);
        
        if (typeof contract[method] !== 'function') throw new Error('Method not exists');
        if (this.gasUsed > this.gasLimit) throw new Error('Gas limit exceeded');
        
        this.gasUsed += 5000;
        return contract[method](state, params, sender);
    }

    getContractState(contractAddress) {
        return this.contractState.get(contractAddress) || null;
    }

    transferToContract(contractAddress, amount, sender) {
        const state = this.contractState.get(contractAddress);
        if (!state) return false;
        state.balance += amount;
        this.gasUsed += 1000;
        return true;
    }

    resetGasCounter() {
        this.gasUsed = 0;
    }
}

module.exports = SmartContractVirtualMachine;
