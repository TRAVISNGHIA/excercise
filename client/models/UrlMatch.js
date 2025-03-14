import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    url: String,
});

module.exports = mongoose.model('url', urlSchema);