
import Result from '../../models/Result.js';
import dbConnect from "../../db.js";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        res.json(await Result.find({}));
    } else if (req.method === 'POST') {
        res.json(await new Result(req.body).save());
    } else if (req.method === 'DELETE') {
        const { ids } = req.body;
        await Result.deleteMany({ _id: { $in: ids } });
        res.json({ message: 'Deleted', deletedCount: ids.length });
    } else if (req.method === 'PUT') {
        res.json(await Result.findByIdAndUpdate(req.query.id, req.body, { new: true }));
    }
}