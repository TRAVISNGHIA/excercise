import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    url: String,
});

const urlMatch= mongoose.model('url', urlSchema);

export default urlMatch