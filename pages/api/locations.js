import dbConnect from "../../db.js";
import Location from "../../models/Location.js";
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
            const locations = await Location.find({});
            return res.status(200).json({ success: true, data: locations });
        }

        if (req.method === "POST") {
            const newLocation = new Location(req.body);
            const savedLocation = await newLocation.save();
            return res.status(201).json({ success: true, data: savedLocation, message: "Tạo location thành công!" });
        }

        if (req.method === "PUT") {
            if (!id) {
                return res.status(400).json({ success: false, message: "Thiếu ID!" });
            }

            const updateData = { ...req.body };
            delete updateData._id;

            const updatedLocation = await Location.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedLocation) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để cập nhật!" });
            }

            return res.status(200).json({ success: true, data: updatedLocation, message: "Cập nhật thành công!" });
        }

        if (req.method === "DELETE") {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ success: false, message: "Danh sách ID không hợp lệ!" });
            }

            const uniqueIds = [...new Set(ids)];
            const result = await Location.deleteMany({ _id: { $in: uniqueIds } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy dữ liệu để xóa!" });
            }

            return res.status(200).json({
                success: true,
                message: "Xóa thành công!",
                deletedCount: result.deletedCount,
            });
        }

        return res.status(405).json({ success: false, message: `Method ${req.method} không được hỗ trợ!` });

    } catch (error) {
        console.error("Lỗi API Location:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi xử lý dữ liệu!",
            error: error.message,
        });
    }
}
