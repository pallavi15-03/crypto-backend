const dotenv = require("dotenv");

dotenv.config();

const ALCHEMY_ETH_ENDPOINT = process.env.ALCHEMY_ETH_ENDPOINT;

if (!ALCHEMY_ETH_ENDPOINT) {
    throw new Error("ALCHEMY_ETH_ENDPOINT is not configured in .env");
}

const alchemyRequest = async (method, params = []) => {
    try {
        const response = await fetch(ALCHEMY_ETH_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method,
                params
            })
        });

        if (!response.ok) {
            throw new Error(`Alchemy API HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || "Alchemy API error");
        }

        return data.result;
    } catch (error) {
        console.error("Alchemy request failed:", error.message);
        throw error;
    }
};

module.exports = {
    alchemyRequest
};