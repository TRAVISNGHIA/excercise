import ResultLog from "../../models/ResultLog"; // Sửa "resultLogs" thành "resultLogs"
import dbConnect from "../../db.js";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        const resultLogs = await ResultLog.find({});
        return res.status(200).json(resultLogs);
    }

    if (req.method === "POST") {
        if (!req.body.brand || !req.body.location) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc!" });
        }
        const newLog = await ResultLog.create(req.body);
        return res.status(201).json({ success: true, data: newLog, message: "Thêm mới thành công!" });
    }
    if (req.method === "PUT") {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ success: false, message: "ID không hợp lệ!" });
        }
        const updatedLog = await ResultLog.updateOne({ _id: id }, { $set: req.body });
        if (updatedLog.modifiedCount) {
            return res.status(200).json({ success: true, message: "Cập nhật thành công!" });
        } else {
            return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để cập nhật!" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { ids } = req.body;
            await ResultLog.deleteMany({ _id: { $in: ids } });
            return res.status(200).json({ success: true, message: "Xóa thành công" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Lỗi khi xóa dữ liệu", error });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
}