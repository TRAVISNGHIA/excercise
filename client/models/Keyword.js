import mongoose from 'mongoose';

const KeywordSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });


const Keyword  = mongoose.model("Keyword", KeywordSchema);

export default Keyword;