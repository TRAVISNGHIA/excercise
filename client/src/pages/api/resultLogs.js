import db from "../../../models/db.js";
import ResultLog from "../../../models/ResultLog.js";

export default async function handler(req, res) {
    await db;
    if (req.method === "GET") {
        res.json(await ResultLog.find({}));
    } else if (req.method === "POST") {
        res.json(await new ResultLog(req.body).save());
    } else if (req.method === "DELETE") {
        await ResultLog.findById(req.query.id);
        res.json({ message: "Deleted" });
    } else if (req.method === "PUT") {
        res.json(await ResultLog.findByIdAndUpdate(req.query.id, req.body, { new: true }));
    }
}
