const Location = require("../models/locations");

const locationController = {

    getAllLocations: async (req, res) => {
        try {
            const locations = await Location.find();
            return res.status(200).json(locations);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách địa điểm:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getLocationById: async (req, res) => {
        try {
            const location = await Location.findById(req.params.id);
            if (!location) {
                return res.status(404).json({ error: "Không tìm thấy địa điểm" });
            }
            return res.status(200).json(location);
        } catch (err) {
            console.error("❌ Lỗi khi lấy địa điểm:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createLocation: async (req, res) => {
        try {
            const { encodedId, name, city, province, country } = req.body;
            if (!encodedId || !name) {
                return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
            }

            const newLocation = new Location({
                encodedId,
                name,
                city,
                province,
                country
            });

            const savedLocation = await newLocation.save();
            return res.status(201).json(savedLocation);
        } catch (err) {
            console.error("❌ Lỗi khi tạo địa điểm:", err);
            return res.status(500).json({ error: "Lỗi server khi tạo địa điểm" });
        }
    },

    updateLocation: async (req, res) => {
        try {
            const { name, city, province, country } = req.body;

            const updatedLocation = await Location.findByIdAndUpdate(
                req.params.id,
                { name, city, province, country },
                { new: true, runValidators: true }
            );

            if (!updatedLocation) {
                return res.status(404).json({ error: "Không tìm thấy địa điểm để cập nhật" });
            }

            return res.status(200).json(updatedLocation);
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật địa điểm:", err);
            return res.status(500).json({ error: "Lỗi server khi cập nhật địa điểm" });
        }
    },

    deleteLocation: async (req, res) => {
        try {
            const deletedLocation = await Location.findByIdAndDelete(req.params.id);
            if (!deletedLocation) {
                return res.status(404).json({ error: "Không tìm thấy địa điểm để xóa" });
            }
            return res.status(200).json({ message: "Đã xóa địa điểm thành công" });
        } catch (err) {
            console.error("❌ Lỗi khi xóa địa điểm:", err);
            return res.status(500).json({ error: "Lỗi server khi xóa địa điểm" });
        }
    }
};

module.exports = locationController;
