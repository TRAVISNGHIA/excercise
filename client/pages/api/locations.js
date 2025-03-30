import dbConnect from "../../db.js";
import Location from "../../models/Location.js";

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req, res) {
    await dbConnect(); // Kết nối đến MongoDB

    if (req.method === "GET") {
        try {
            const locations = await Location.find({});
            res.status(200).json(locations);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "POST") {
        try {
            const newLocation = new Location(req.body);
            const savedLocation = await newLocation.save();
            res.status(201).json(savedLocation);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else if (req.method === "PUT") {
        try {
            const { id } = req.query; // Lấy ID từ query params
            if (!id) return res.status(400).json({ error: "Thiếu ID" });

            const updatedLocation = await Location.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedLocation) return res.status(404).json({ error: "Không tìm thấy dữ liệu" });

            res.status(200).json(updatedLocation);
        } catch (error) {
            res.status(500).json({ error: "Lỗi cập nhật dữ liệu" });
        }
    } else if (req.method === "DELETE") {
        try {
            const { id } = req.query;
            if (!id) return res.status(400).json({ error: "Thiếu ID để xóa" });

            const deletedLocation = await Location.findByIdAndDelete(id);
            if (!deletedLocation) return res.status(404).json({ error: "Không tìm thấy dữ liệu để xóa" });

            res.status(200).json({ message: "Xóa thành công" });
        } catch (error) {
            res.status(500).json({ error: "Lỗi xóa dữ liệu" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
