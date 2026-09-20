const { alchemyRequest } = require("./alchemyService");

const getTransaction = async (txHash) => {
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
        throw new Error("Invalid Ethereum transaction hash");
    }

    const transaction = await alchemyRequest(
        "eth_getTransactionByHash",
        [txHash]
    );

    return transaction;
};

const getTransactionReceipt = async (txHash) => {
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
        throw new Error("Invalid Ethereum transaction hash");
    }

    const receipt = await alchemyRequest(
        "eth_getTransactionReceipt",
        [txHash]
    );

    return receipt;
};

const getTransactionDetails = async (txHash) => {
    const [transaction, receipt] = await Promise.all([
        getTransaction(txHash),
        getTransactionReceipt(txHash)
    ]);

    return {
        transaction,
        receipt
    };
};

module.exports = {
    getTransaction,
    getTransactionReceipt,
    getTransactionDetails
};