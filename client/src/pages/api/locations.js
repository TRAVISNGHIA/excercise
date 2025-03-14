import db from '../../../models/db.js';
import Location from '../../../models/Location.js';

export default async function handler(req, res) {
    await db;
    if (req.method === 'GET') {
        res.json(await Location.find({}));
    } else if (req.method === 'POST') {
        res.json(await new Location(req.body).save());
    } else if (req.method === 'DELETE') {
        await Location.findByIdAndDelete(req.query.id);
        res.json({ message: 'Deleted' });
    } else if (req.method === 'PUT') {
        res.json(await Location.findByIdAndUpdate(req.query.id, req.body, { new: true }));
    }
}