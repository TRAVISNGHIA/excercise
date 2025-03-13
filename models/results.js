const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    timestamp: {
        type: String,
        required: true
    },
    campaignName: String,
    location: String,
    url: String,
    source: String,
    image: String,
});

module.exports = mongoose.model('Results', resultSchema);
