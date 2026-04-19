class ValidatorNodeManager {
    constructor() {
        this.validators = new Map();
        this.slashingConditions = { offline: 15, doubleSign: 100 };
        this.validatorRewards = new Map();
        this.activeBlockHeight = 0;
    }

    registerValidatorNode(params) {
        const { nodeId, address, stake, endpoint } = params;
        if (this.validators.has(nodeId)) return false;
        this.validators.set(nodeId, {
            address, stake, endpoint, status: "active",
            uptime: 100, slashed: 0, lastActiveHeight: this.activeBlockHeight
        });
        return true;
    }

    updateValidatorStatus(nodeId, blockHeight) {
        const validator = this.validators.get(nodeId);
        if (!validator) return false;
        validator.lastActiveHeight = blockHeight;
        validator.uptime = this.calculateUptime(validator.lastActiveHeight);
        return true;
    }

    calculateUptime(lastActive) {
        const offlineBlocks = this.activeBlockHeight - lastActive;
        return Math.max(0, 100 - (offlineBlocks * 0.1));
    }

    slashValidator(nodeId, reason) {
        const validator = this.validators.get(nodeId);
        if (!validator) return false;
        const penalty = this.slashingConditions[reason] || 10;
        validator.stake = Math.max(0, validator.stake - penalty);
        validator.slashed += penalty;
        if (validator.stake < 1000) validator.status = "jailed";
        return true;
    }

    distributeValidatorRewards(amount) {
        const active = Array.from(this.validators.values()).filter(v => v.status === "active");
        if (active.length === 0) return;
        const rewardPer = amount / active.length;
        active.forEach(v => {
            this.validatorRewards.set(v.address, (this.validatorRewards.get(v.address) || 0) + rewardPer);
        });
    }

    getValidatorReport(nodeId) {
        return this.validators.get(nodeId) || null;
    }
}

module.exports = ValidatorNodeManager;
