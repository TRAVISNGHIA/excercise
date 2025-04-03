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

const ResultLog = mongoose.models.ResultLog || mongoose.model("ResultLog", resultLogSchema);
export default ResultLog;