const Keyword = require("../models/keywords");

const keywordController = {
    getAllKeywords: async (req, res) => {
        try {
            const keywords = await Keyword.find();
            return res.status(200).json(keywords);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách keywords:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createKeyword: async (req, res) => {
        try {
            const { key } = req.body;
            if (!key) {
                return res.status(400).json({ error: "Thiếu dữ liệu key" });
            }

            const newKey = new Keyword({ key });
            const savedKey = await newKey.save();
            return res.status(201).json(savedKey);
        } catch (err) {
            console.error("❌ Lỗi khi tạo keyword:", err);
            return res.status(500).json({ error: "Lỗi server khi tạo keyword" });
        }
    },

    deleteKey: async (req, res) => {
        try {
            const deletedKey = await Keyword.findById(req.params.id);
            if (!deletedKey) {
                return res.status(404).json({ error: "Không tìm thấy keyword để xóa" });
            }
            return res.status(200).json({ message: "Đã xóa keyword thành công" });
        } catch (error) {
            console.error("❌ Lỗi khi xóa keyword:", error);
            return res.status(500).json({ error: "Lỗi server khi xóa keyword" });
        }
    },

    updateKey: async (req, res) => {
        try {
            const { key } = req.body;
            if (!key) {
                return res.status(400).json({ error: "Thiếu dữ liệu key để cập nhật" });
            }

            const updatedKey = await Keyword.findByIdAndUpdate(
                req.params.id,
                { key },
                { new: true, runValidators: true }
            );

            if (!updatedKey) {
                return res.status(404).json({ error: "Không tìm thấy keyword để cập nhật" });
            }

            return res.status(200).json(updatedKey);
        } catch (error) {
            console.error("Lỗi khi cập nhật keyword:", error);
            return res.status(500).json({ error: "Lỗi server khi cập nhật keyword" });
        }
    }
};

module.exports = keywordController;
