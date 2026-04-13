const dotenv = require("dotenv");
dotenv.config();

if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("PERPLEXITY_API_KEY missing in .env");
}