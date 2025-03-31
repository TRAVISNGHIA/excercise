import mongoose from 'mongoose';
import Keyword from '../../models/Keyword';

export default async function handler(req, res) {
    await mongoose.connect(process.env.MONGODB_URI);

    try {
        if (req.method === 'GET') {
            return res.status(200).json(await Keyword.find());
        } else if (req.method === 'POST') {
            const { key } = req.body;
            if (!key) return res.status(400).json({ error: 'Từ khóa là bắt buộc' });
            return res.status(201).json(await new Keyword({ key }).save());
        } else if (req.method === 'PUT') {
            const { id } = req.query, { key } = req.body;
            if (!id || !key) return res.status(400).json({ error: 'ID và từ khóa là bắt buộc' });
            const updatedKeyword = await Keyword.findByIdAndUpdate(id, { key }, { new: true });
            return updatedKeyword ? res.status(200).json(updatedKeyword) : res.status(404).json({ error: 'Không tìm thấy từ khóa' });
        } else if (req.method === 'DELETE') {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'Danh sách IDs không hợp lệ' });
            const result = await Keyword.deleteMany({ _id: { $in: ids } });
            return result.deletedCount ? res.status(200).json({ message: 'Xóa thành công', deletedCount: result.deletedCount }) : res.status(404).json({ error: 'Không tìm thấy mục nào để xóa' });
        } else {
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi xử lý dữ liệu' });
    }
}