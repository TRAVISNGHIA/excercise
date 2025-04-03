import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    url: { type: String, required: true },
});

const UrlMatch = mongoose.models.UrlMatch || mongoose.model('UrlMatch', urlSchema, 'urlmatchs');

export default UrlMatch;
