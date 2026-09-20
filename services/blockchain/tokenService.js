const { alchemyRequest } = require("./alchemyService");

const getTokenTransfers = async (address, direction = "from", pageKey = null) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error("Invalid Ethereum wallet address");
    }

    if (direction !== "from" && direction !== "to") {
        throw new Error('Direction must be either "from" or "to"');
    }

    const addressFilter =
        direction === "from"
            ? { fromAddress: address }
            : { toAddress: address };

    const params = {
        ...addressFilter,
        category: ["erc20"],
        withMetadata: true,
        maxCount: "0x64"
    };

    if (pageKey) {
        params.pageKey = pageKey;
    }

    const result = await alchemyRequest(
        "alchemy_getAssetTransfers",
        [params]
    );

    return {
        transfers: result.transfers,
        pageKey: result.pageKey || null
    };
};

const scanTokenTransfers = async (address) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error("Invalid Ethereum wallet address");
    }

    const [incoming, outgoing] = await Promise.all([
        getTokenTransfers(address, "to"),
        getTokenTransfers(address, "from")
    ]);

    return {
        address,
        incoming: incoming.transfers,
        outgoing: outgoing.transfers,
        incomingPageKey: incoming.pageKey,
        outgoingPageKey: outgoing.pageKey
    };
};

module.exports = {
    getTokenTransfers,
    scanTokenTransfers
};