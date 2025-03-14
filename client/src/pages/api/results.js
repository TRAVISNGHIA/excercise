import db from '../../../models/db.js';
import Result from '../../../models/Result.js';

export default async function handler(req, res) {
    await db;
    if (req.method === 'GET') {
        res.json(await Result.find({}));
    } else if (req.method === 'POST') {
        res.json(await new Result(req.body).save());
    } else if (req.method === 'DELETE') {
        await Result.findByIdAndDelete(req.query.id);
        res.json({ message: 'Deleted' });
    } else if (req.method === 'PUT') {
        res.json(await Result.findByIdAndUpdate(req.query.id, req.body, { new: true }));
    }
}