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
            return res.status(200).json({ message: "Thành công!" });
        }

        if (req.method === "POST") {
            const newLocation = new Location(req.body);
            const savedLocation = await newLocation.save();
            return res.status(201).json(savedLocation);
        }

        if (req.method === "PUT") {
            if (!id) return res.status(400).json({ error: "Thiếu ID" });

            const updateData = { ...req.body };
            delete updateData._id; // Tránh lỗi nếu `_id` bị gửi lên

            const updatedLocation = await Location.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedLocation) return res.status(404).json({ error: "Không tìm thấy dữ liệu" });

            return res.status(200).json(updatedLocation);
        }

        if (req.method === "DELETE") {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: "Thiếu danh sách ID để xóa" });
            }

            const uniqueIds = [...new Set(ids)];
            const result = await Location.deleteMany({ _id: { $in: uniqueIds } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Không tìm thấy dữ liệu để xóa" });
            }

            return res.status(200).json({ message: "Xóa thành công", deletedCount: result.deletedCount });
        }

        return res.status(405).json({ error: `Method ${req.method} không được hỗ trợ` });
    } catch (error) {
        console.error("Lỗi API:", error);
        return res.status(500).json({ error: "Lỗi xử lý dữ liệu", details: error.message });
    }
}
