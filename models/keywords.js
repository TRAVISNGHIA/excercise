const mongoose = require("mongoose");

const KeywordSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Keyword", KeywordSchema);
