import mongoose from 'mongoose';

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
const Result = mongoose.models.Result || mongoose.model("Result", resultSchema);

export default Result;