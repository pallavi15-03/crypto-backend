const express = require("express");

const { scanWallet } = require("../services/blockchain/walletService");
const { getTransactionDetails } = require("../services/blockchain/transactionService");
const { scanTokenTransfers } = require("../services/blockchain/tokenService");

const router = express.Router();

router.get("/wallet/:address", async (req, res, next) => {
    try {
        const { address } = req.params;

        const result = await scanWallet(address);

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/transaction/:txHash", async (req, res, next) => {
    try {
        const { txHash } = req.params;

        const result = await getTransactionDetails(txHash);

        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get("/tokens/:address", async (req, res, next) => {
    try {
        const { address } = req.params;

        const result = await scanTokenTransfers(address);

        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router;