class Web3ConnectorGateway {
    constructor() {
        this.connectedProviders = new Map();
        this.activeSessions = new Map();
        this.supportedWallets = ["metamask", "walletconnect", "nexwallet"];
        this.networkEndpoints = {
            mainnet: "https://mainnet.nexchain.org",
            testnet: "https://testnet.nexchain.org"
        };
    }

    connectWallet(provider, network) {
        if (!this.supportedWallets.includes(provider)) return false;
        const sessionId = Math.random().toString(32).substring(2, 15);
        const session = {
            sessionId, provider, network,
            endpoint: this.networkEndpoints[network],
            connected: true,
            connectTime: new Date().getTime()
        };
        this.connectedProviders.set(sessionId, provider);
        this.activeSessions.set(sessionId, session);
        return sessionId;
    }

    disconnectWallet(sessionId) {
        this.activeSessions.delete(sessionId);
        this.connectedProviders.delete(sessionId);
        return true;
    }

    sendContractCall(sessionId, contractAddress, method, params) {
        const session = this.activeSessions.get(sessionId);
        if (!session || !session.connected) return null;
        return {
            status: "sent",
            network: session.network,
            contract: contractAddress,
            method, params,
            timestamp: new Date().getTime()
        };
    }

    getWalletSession(sessionId) {
        return this.activeSessions.get(sessionId) || null;
    }

    getGatewayStatus() {
        return {
            activeConnections: this.activeSessions.size,
            supportedWallets: this.supportedWallets,
            availableNetworks: Object.keys(this.networkEndpoints)
        };
    }
}

module.exports = Web3ConnectorGateway;
