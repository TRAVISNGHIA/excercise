import mongoose from 'mongoose';
import Keyword from '../../models/Keyword';

export default async function handler(req, res) {
    await mongoose.connect(process.env.MONGODB_URI);

    try {
        if (req.method === 'GET') {
            const keywords = await Keyword.find();
            res.status(200).json(keywords);
        } else if (req.method === 'POST') {
            const { key } = req.body;
            if (!key) {
                res.status(400).json({ error: 'Từ khóa là bắt buộc' });
                return;
            }
            const newKeyword = await new Keyword({ key }).save();
            res.status(201).json(newKeyword);
        } else if (req.method === 'PUT') {
            const { id } = req.query;
            const { key } = req.body;
            if (!id || !key) {
                res.status(400).json({ error: 'ID và từ khóa là bắt buộc' });
                return;
            }
            const updatedKeyword = await Keyword.findByIdAndUpdate(id, { key }, { new: true });
            if (updatedKeyword) {
                res.status(200).json(updatedKeyword);
            } else {
                res.status(404).json({ error: 'Không tìm thấy từ khóa' });
            }
        } else if (req.method === 'DELETE') {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ error: 'Danh sách IDs không hợp lệ' });
                return;
            }
            const result = await Keyword.deleteMany({ _id: { $in: ids } });
            if (result.deletedCount) {
                res.status(200).json({ message: 'Xóa thành công', deletedCount: result.deletedCount });
            } else {
                res.status(404).json({ error: 'Không tìm thấy mục nào để xóa' });
            }
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi xử lý dữ liệu' });
    }
}
