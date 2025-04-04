import Result from '../../models/Result.js';
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
            const results = await Result.find({});
            return res.status(200).json(results);
        }

        if (req.method === "POST") {
            if (!req.body) {
                return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ!" });
            }

            const newResult = new Result(req.body);
            await newResult.save();
            return res.status(201).json({ success: true, data: newResult, message: "Thêm mới thành công!" });
        }

        if (req.method === "PUT") {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, message: "Thiếu ID để cập nhật!" });
            }

            const updatedResult = await Result.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

            if (!updatedResult) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để cập nhật!" });
            }

            return res.status(200).json({ success: true, data: updatedResult, message: "Cập nhật thành công!" });
        }

        if (req.method === "DELETE") {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ success: false, message: "Danh sách ID không hợp lệ!" });
            }

            const result = await Result.deleteMany({ _id: { $in: ids } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để xóa!" });
            }

            return res.status(200).json({ success: true, message: "Xóa thành công!", deletedCount: result.deletedCount });
        }

        return res.status(405).json({ success: false, message: `Method ${req.method} không được hỗ trợ` });
    } catch (error) {
        console.error("Lỗi API:", error);
        return res.status(500).json({ success: false, message: "Lỗi xử lý dữ liệu", error: error.message });
    }
}