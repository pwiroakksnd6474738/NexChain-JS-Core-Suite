class ChainGovernanceVoting {
    constructor() {
        this.proposals = new Map();
        this.votes = new Map();
        this.proposalIdCounter = 1;
        this.minStakeToPropose = 50000;
        this.votingPeriod = 7 * 24 * 60 * 60;
    }

    createProposal(params) {
        const { creator, title, description, executionCode, stake } = params;
        if (stake < this.minStakeToPropose) return false;
        const proposalId = this.proposalIdCounter++;
        const proposal = {
            proposalId, creator, title, description, executionCode,
            startTime: new Date().getTime(),
            endTime: new Date().getTime() + this.votingPeriod,
            status: "active", forVotes: 0, againstVotes: 0
        };
        this.proposals.set(proposalId, proposal);
        this.votes.set(proposalId, new Set());
        return proposalId;
    }

    castVote(proposalId, voter, voteChoice, stakePower) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal || proposal.status !== "active") return false;
        if (new Date().getTime() > proposal.endTime) return false;
        const voted = this.votes.get(proposalId);
        if (voted.has(voter)) return false;
        voted.add(voter);
        if (voteChoice === "for") proposal.forVotes += stakePower;
        else proposal.againstVotes += stakePower;
        return true;
    }

    finalizeProposal(proposalId) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal || proposal.status !== "active") return false;
        if (new Date().getTime() < proposal.endTime) return false;
        proposal.status = proposal.forVotes > proposal.againstVotes ? "passed" : "rejected";
        return proposal.status;
    }

    getProposalResult(proposalId) {
        return this.proposals.get(proposalId) || null;
    }

    listActiveProposals() {
        return Array.from(this.proposals.values()).filter(p => p.status === "active");
    }
}

module.exports = ChainGovernanceVoting;
