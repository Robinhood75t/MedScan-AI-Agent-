const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tokenHash:{
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

tokenSchema.index({ expiresAt: 1}, {expiresAfterSeconds: 0});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;