import db from '../../../models/db.js';
import Keyword from '../../../models/Keyword.js';

export default async function handler(req, res) {
    await db;
    if (req.method === 'GET') {
        res.json(await Keyword.find({}));
    } else if (req.method === 'POST') {
        res.json(await new Keyword(req.body).save());
    } else if (req.method === 'DELETE') {
        await Keyword.findByIdAndDelete(req.query.id);
        res.json({ message: 'Deleted' });
    } else if (req.method === 'PUT') {
        res.json(await Keyword.findByIdAndUpdate(req.query.id, req.body, { new: true }));
    }
}