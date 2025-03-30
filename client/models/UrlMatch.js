import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    url: String,
});

const UrlMatch = mongoose.models.UrlMatch || mongoose.model('UrlMatch', urlSchema);

export default UrlMatch;