const Url = require("../models/urlMatchs");

const urlController = {
    getAllUrls: async (req, res) => {
        try {
            const urls = await Url.find();
            return res.status(200).json(urls);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách URL:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getUrlById: async (req, res) => {
        try {
            const url = await Url.findById(req.params.id);
            if (!url) {
                return res.status(404).json({ error: "Không tìm thấy URL" });
            }
            return res.status(200).json(url);
        } catch (err) {
            console.error("❌ Lỗi khi lấy URL:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createUrl: async (req, res) => {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: "Thiếu dữ liệu URL" });
            }

            const newUrl = new Url({ url });
            const savedUrl = await newUrl.save();
            return res.status(201).json(savedUrl);
        } catch (err) {
            console.error("Lỗi khi tạo URL:", err);
            return res.status(500).json({ error: "Lỗi server khi tạo URL" });
        }
    },

    updateUrl: async (req, res) => {
        try {
            const { url } = req.body;
            if (!url) {
                return res.status(400).json({ error: "Thiếu dữ liệu URL để cập nhật" });
            }

            const updatedUrl = await Url.findByIdAndUpdate(
                req.params.id,
                { url },
                { new: true, runValidators: true }
            );

            if (!updatedUrl) {
                return res.status(404).json({ error: "Không tìm thấy URL để cập nhật" });
            }

            return res.status(200).json(updatedUrl);
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật URL:", err);
            return res.status(500).json({ error: "Lỗi server khi cập nhật URL" });
        }
    },

    deleteUrl: async (req, res) => {
        try {
            const deletedUrl = await Url.findByIdAndDelete(req.params.id);
            if (!deletedUrl) {
                return res.status(404).json({ error: "Không tìm thấy URL để xóa" });
            }
            return res.status(200).json({ message: "Đã xóa URL thành công" });
        } catch (err) {
            console.error("❌ Lỗi khi xóa URL:", err);
            return res.status(500).json({ error: "Lỗi server khi xóa URL" });
        }
    }
};

module.exports = urlController;
