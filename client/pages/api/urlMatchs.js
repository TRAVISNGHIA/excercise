import UrlMatch from '../../models/UrlMatch.js';
import dbConnect from "../../db.js";

export default async function handler(req, res) {
    await dbConnect();

    try {
        if (req.method === 'GET') {
            const urlmatchs = await UrlMatch.find({});
            return res.status(200).json(urlmatchs);
        } else if (req.method === 'POST') {
            if (!req.body.url) {
                return res.status(400).json({ error: 'URL is required' });
            }
            const newUrl = await new UrlMatch(req.body).save();
            return res.status(201).json(newUrl);
        } else if (req.method === 'DELETE') {
            const deletedUrl = await UrlMatch.findByIdAndDelete(req.query.id);
            if (!deletedUrl) {
                return res.status(404).json({ error: 'URL not found' });
            }
            return res.status(200).json({ message: 'Deleted successfully' });
        } else if (req.method === 'PUT') {
            if (!req.body.url) {
                return res.status(400).json({ error: 'URL is required' });
            }
            const updatedUrl = await UrlMatch.findByIdAndUpdate(req.query.id, req.body, { new: true });
            if (!updatedUrl) {
                return res.status(404).json({ error: 'URL not found' });
            }
            return res.status(200).json(updatedUrl);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}