import UrlMatch from '../../models/UrlMatch.js';
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
            const urlMatches = await UrlMatch.find({});
            return res.status(200).json(urlMatches);
        }

        if (req.method === "POST") {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ success: false, message: "URL is required" });
            }

            const newUrl = new UrlMatch(req.body);
            await newUrl.save();
            return res.status(201).json({ success: true, data: newUrl, message: "Thêm mới thành công!" });
        }

        if (req.method === "PUT") {
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ success: false, message: "Thiếu ID để cập nhật!" });
            }

            const updatedUrl = await UrlMatch.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

            if (!updatedUrl) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để cập nhật!" });
            }

            return res.status(200).json({ success: true, data: updatedUrl, message: "Cập nhật thành công!" });
        }

        if (req.method === "DELETE") {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ success: false, message: "Thiếu ID để xóa!" });
            }

            const deletedUrl = await UrlMatch.findByIdAndDelete(id);

            if (!deletedUrl) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để xóa!" });
            }

            return res.status(200).json({ success: true, message: "Xóa thành công!" });
        }

        return res.status(405).json({ success: false, message: `Method ${req.method} không được hỗ trợ` });
    } catch (error) {
        console.error("Lỗi API:", error);
        return res.status(500).json({ success: false, message: "Lỗi xử lý dữ liệu", error: error.message });
    }
}