import dbConnect from "../../db.js";
import Location from "../../models/Location.js";

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            if (id) {
                const location = await Location.findById(id);
                if (!location) return res.status(404).json({ error: "Không tìm thấy dữ liệu" });
                return res.status(200).json(location);
            }
            const locations = await Location.find({});
            return res.status(200).json(locations);
        } catch (error) {
            return res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
        }
    }

    if (req.method === "POST") {
        try {
            const newLocation = new Location(req.body);
            const savedLocation = await newLocation.save();
            return res.status(201).json(savedLocation);
        } catch (error) {
            console.error("Lỗi POST:", error);
            return res.status(400).json({ error: "Lỗi khi thêm dữ liệu", details: error.message });
        }
    }

    if (req.method === "PUT") {
        try {
            if (!id) return res.status(400).json({ error: "Thiếu ID" });

            // Loại bỏ _id từ dữ liệu cập nhật nếu có
            const updateData = { ...req.body };
            if (updateData._id) delete updateData._id;

            const updatedLocation = await Location.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedLocation) return res.status(404).json({ error: "Không tìm thấy dữ liệu" });

            return res.status(200).json(updatedLocation);
        } catch (error) {
            console.error("Lỗi PUT:", error);
            return res.status(500).json({ error: "Lỗi khi cập nhật dữ liệu", details: error.message });
        }
    }

    if (req.method === "DELETE") {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ error: "Thiếu danh sách ID để xóa" });
            }

            // Loại bỏ các ID trùng lặp
            const uniqueIds = [...new Set(ids)];

            const result = await Location.deleteMany({ _id: { $in: uniqueIds } });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: "Không tìm thấy dữ liệu để xóa" });
            }

            return res.status(200).json({ message: "Xóa thành công" });
        } catch (error) {
            console.error("Lỗi DELETE:", error);
            return res.status(500).json({ error: "Lỗi xóa dữ liệu", details: error.message });
        }
    }

    return res.status(405).json({ error: "Method không được hỗ trợ" });
}
