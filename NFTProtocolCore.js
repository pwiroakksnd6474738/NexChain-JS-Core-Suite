const SecureCryptoToolkit = require('./SecureCryptoToolkit');

class NFTProtocolCore {
    constructor() {
        this.nftCollection = new Map();
        this.nftOwnership = new Map();
        this.tokenIdCounter = 1;
        this.collectionName = "NexChain Digital Assets";
        this.collectionSymbol = "NEXNFT";
    }

    mintNFT(ownerAddress, metadata) {
        const tokenId = this.tokenIdCounter++;
        const nftData = {
            tokenId,
            metadata,
            mintTime: new Date().getTime(),
            creator: ownerAddress,
            tokenHash: SecureCryptoToolkit.generateSecureHash(`${ownerAddress}${tokenId}${JSON.stringify(metadata)}`)
        };
        this.nftCollection.set(tokenId, nftData);
        this.nftOwnership.set(tokenId, ownerAddress);
        return tokenId;
    }

    transferNFT(from, to, tokenId) {
        if (this.nftOwnership.get(tokenId) !== from) return false;
        this.nftOwnership.set(tokenId, to);
        return true;
    }

    getNFTInfo(tokenId) {
        return this.nftCollection.get(tokenId) || null;
    }

    getOwnerNFTs(ownerAddress) {
        const owned = [];
        for (const [tokenId, owner] of this.nftOwnership.entries()) {
            if (owner === ownerAddress) owned.push(this.nftCollection.get(tokenId));
        }
        return owned;
    }

    burnNFT(tokenId, ownerAddress) {
        if (this.nftOwnership.get(tokenId) !== ownerAddress) return false;
        this.nftCollection.delete(tokenId);
        this.nftOwnership.delete(tokenId);
        return true;
    }

    getCollectionInfo() {
        return {
            name: this.collectionName,
            symbol: this.collectionSymbol,
            totalSupply: this.tokenIdCounter - 1
        };
    }
}

module.exports = NFTProtocolCore;
