import dbConnect from "../../db";
import Keyword from '../../models/Keyword';
import cors, { runMiddleware } from "../../utils/cors";

export default async function handler(req, res) {
    await dbConnect();
    await runMiddleware(req, res, cors); // ✅ Chạy CORS trước khi xử lý request

    if (req.method === 'OPTIONS') {
        res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS"); // ✅ Định nghĩa các phương thức được phép
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const keywords = await Keyword.find();
            res.status(200).json(keywords);
        } else if (req.method === 'POST') {
            const { key } = req.body;
            if (!key) return res.status(400).json({ error: 'Từ khóa là bắt buộc' });

            const newKeyword = new Keyword({ key });
            await newKeyword.save();
            res.status(201).json(newKeyword);
        } else if (req.method === 'PUT') {
            const { id } = req.query;
            const { key } = req.body;
            if (!id || !key) return res.status(400).json({ error: 'ID và từ khóa là bắt buộc' });

            const updatedKeyword = await Keyword.findByIdAndUpdate(id, { key }, { new: true });
            if (!updatedKeyword) return res.status(404).json({ error: 'Không tìm thấy từ khóa' });

            res.status(200).json(updatedKeyword);
        } else if (req.method === 'DELETE') {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'Danh sách IDs không hợp lệ' });

            const result = await Keyword.deleteMany({ _id: { $in: ids } });
            if (!result.deletedCount) return res.status(404).json({ error: 'Không tìm thấy mục nào để xóa' });

            res.status(200).json({ message: 'Xóa thành công', deletedCount: result.deletedCount });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error("Lỗi API:", error);
        res.status(500).json({ error: 'Lỗi xử lý dữ liệu' });
    }
}
