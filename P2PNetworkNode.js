const WebSocket = require('ws');

class P2PNetworkNode {
    constructor(port) {
        this.port = port;
        this.peers = new Set();
        this.server = null;
        this.messageHandlers = new Map();
    }

    startServer() {
        this.server = new WebSocket.Server({ port: this.port });
        this.server.on('connection', (ws) => this.handleConnection(ws));
        console.log(`P2P Node running on port ${this.port}`);
    }

    handleConnection(ws) {
        ws.on('message', (data) => this.handleMessage(ws, data));
        ws.on('close', () => this.peers.delete(ws));
        this.peers.add(ws);
    }

    connectToPeer(address) {
        const ws = new WebSocket(address);
        ws.on('open', () => this.handleConnection(ws));
        ws.on('error', () => console.log('Peer connection failed'));
    }

    broadcast(message) {
        this.peers.forEach(peer => {
            if (peer.readyState === WebSocket.OPEN) {
                peer.send(JSON.stringify(message));
            }
        });
    }

    handleMessage(ws, data) {
        const message = JSON.parse(data);
        const handler = this.messageHandlers.get(message.type);
        if (handler) handler(message.payload, ws);
    }

    registerMessageHandler(type, callback) {
        this.messageHandlers.set(type, callback);
    }

    getPeerCount() {
        return this.peers.size;
    }
}

module.exports = P2PNetworkNode;
