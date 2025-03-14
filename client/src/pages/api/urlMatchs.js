import db from '../../../models/db.js';
import UrlMatch from '../../../models/UrlMatch.js';

export default async function handler(req, res) {
    await db;
    if (req.method === 'GET') {
        res.json(await UrlMatch.find({}));
    } else if (req.method === 'POST') {
        res.json(await new UrlMatch(req.body).save());
    } else if (req.method === 'DELETE') {
        await UrlMatch.findByIdAndDelete(req.query.id);
        res.json({ message: 'Deleted' });
    } else if (req.method === 'PUT') {
        res.json(await UrlMatch.findByIdAndUpdate(req.query.id, req.body, { new: true }));
    }
}