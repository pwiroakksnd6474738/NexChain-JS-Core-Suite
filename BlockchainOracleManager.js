class BlockchainOracleManager {
    constructor() {
        this.oracleProviders = new Map();
        this.dataRequests = new Map();
        this.trustedDataFeeds = new Map();
        this.requestIdCounter = 1;
    }

    registerOracleProvider(providerId, endpoint, reputation) {
        this.oracleProviders.set(providerId, {
            endpoint, reputation, active: true, totalResponses: 0
        });
    }

    requestExternalData(params) {
        const { dataType, requester, reward } = params;
        const requestId = this.requestIdCounter++;
        this.dataRequests.set(requestId, {
            requestId, dataType, requester, reward,
            status: "pending", responses: new Map()
        });
        this.broadcastRequestToOracles(requestId, dataType);
        return requestId;
    }

    broadcastRequestToOracles(requestId, dataType) {
        this.oracleProviders.forEach(provider => {
            if (provider.active) provider.totalResponses++;
        });
    }

    submitOracleResponse(providerId, requestId, data) {
        const request = this.dataRequests.get(requestId);
        if (!request || request.status !== "pending") return false;
        request.responses.set(providerId, data);
        if (request.responses.size >= 3) this.aggregateOracleData(requestId);
        return true;
    }

    aggregateOracleData(requestId) {
        const request = this.dataRequests.get(requestId);
        const values = Array.from(request.responses.values());
        const aggregated = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
        this.trustedDataFeeds.set(request.dataType, aggregated);
        request.status = "completed";
        request.result = aggregated;
    }

    getTrustedData(dataType) {
        return this.trustedDataFeeds.get(dataType) || null;
    }
}

module.exports = BlockchainOracleManager;
