import ResultLog from "../../models/ResultLog";
import dbConnect from "../../db.js";
import cors, { runMiddleware } from "../../utils/cors";

export default async function handler(req, res) {
    await dbConnect();
    await runMiddleware(req, res, cors);

    try {
        if (req.method === "OPTIONS") {
            res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
            return res.status(200).end();
        }

        if (req.method === "GET") {
            const resultLogs = await ResultLog.find({});
            return res.status(200).json(resultLogs);
        }

        if (req.method === "POST") {
            const { brand, location } = req.body;
            if (!brand || !location) {
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

            const updatedLog = await ResultLog.findByIdAndUpdate(id, { $set: req.body }, { new: true });

            if (!updatedLog) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để cập nhật!" });
            }

            return res.status(200).json({ success: true, data: updatedLog, message: "Cập nhật thành công!" });
        }

        if (req.method === "DELETE") {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ success: false, message: "Danh sách ID không hợp lệ!" });
            }

            const result = await ResultLog.deleteMany({ _id: { $in: ids } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để xóa!" });
            }

            return res.status(200).json({ success: true, message: "Xóa thành công!", deletedCount: result.deletedCount });
        }

        return res.status(405).json({ message: `Method ${req.method} không được hỗ trợ` });
    } catch (error) {
        console.error("Lỗi API:", error);
        return res.status(500).json({ success: false, message: "Lỗi xử lý dữ liệu", error: error.message });
    }
}