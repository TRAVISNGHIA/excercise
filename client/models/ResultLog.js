import mongoose from 'mongoose';

const resultLogSchema = new mongoose.Schema({
    timestamp: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        ref: "Brand",
        required: true
    },
    location: {
        type: String,
        ref: "Location",
        required: true
    },
    url: {
        type: String,
        required: true
    },
    source: {
        type: String,
        ref: "Source",
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ResultLogs', resultLogSchema);