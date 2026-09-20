const { alchemyRequest } = require("./alchemyService");

const isValidWalletAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const getWalletTransfers = async (
    address,
    direction = "from",
    pageKey = null
) => {
    if (!isValidWalletAddress(address)) {
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
        category: [
            "external",
            "internal",
            "erc20",
            "erc721",
            "erc1155"
        ],
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
const scanWallet = async (address) => {
    if (!isValidWalletAddress(address)) {
        throw new Error("Invalid Ethereum wallet address");
    }

    const [balance, incoming, outgoing] = await Promise.all([
        getWalletBalance(address),
        getWalletTransfers(address, "to"),
        getWalletTransfers(address, "from")
    ]);

    return {
        address,
        balance,
        incoming: incoming.transfers,
        outgoing: outgoing.transfers,
        incomingPageKey: incoming.pageKey,
        outgoingPageKey: outgoing.pageKey
    };
};
const getWalletBalance = async (address) => {
    if (!isValidWalletAddress(address)) {
        throw new Error("Invalid Ethereum wallet address");
    }

    const balanceHex = await alchemyRequest(
        "eth_getBalance",
        [address, "latest"]
    );

    const balanceWei = BigInt(balanceHex);
    const balanceEth = Number(balanceWei) / 1e18;

    return {
        address,
        balanceWei: balanceWei.toString(),
        balanceEth
    };
};

module.exports = {
    isValidWalletAddress,
    getWalletBalance,
    getWalletTransfers,
    scanWallet
};
