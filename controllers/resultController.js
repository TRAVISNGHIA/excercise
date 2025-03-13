const Result = require("../models/results");
const moment = require("moment");

const resultController = {

    getAllResults: async (req, res) => {
        try {
            const results = await Result.find();
            return res.status(200).json(results);
        } catch (err) {
            console.error("❌ Lỗi khi lấy danh sách results:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getResultById: async (req, res) => {
        try {
            const result = await Result.findById(req.params.id);
            if (!result) {
                return res.status(404).json({ error: "Không tìm thấy result" });
            }
            return res.status(200).json(result);
        } catch (err) {
            console.error("❌ Lỗi khi lấy result:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createResult: async (req, res) => {
        try {
            let { timestamp, campaignName, location, url, source, image } = req.body;

            const parsedTimestamp = moment(timestamp, "DD-MM-YYYY hh:mm:ss A", true);
            if (!parsedTimestamp.isValid()) {
                return res.status(400).json({ error: "Định dạng timestamp không hợp lệ" });
            }
            const newResult = new Result({
                timestamp,
                campaignName,
                location,
                url,
                source,
                image
            });

            const savedResult = await newResult.save();
            return res.status(201).json(savedResult);
        } catch (err) {
            console.error("❌ Lỗi khi tạo result:", err);
            return res.status(500).json({ error: "Lỗi server khi tạo result" });
        }
    },

    updateResult: async (req, res) => {
        try {
            let { timestamp, campaignName, location, url, source, image } = req.body;

            // ✅ Chuyển đổi `timestamp` về dạng Date nếu có
            if (timestamp) {
                timestamp = new Date(timestamp);
                if (isNaN(timestamp)) {
                    return res.status(400).json({ error: "Định dạng timestamp không hợp lệ" });
                }
            }

            const updatedResult = await Result.findByIdAndUpdate(
                req.params.id,
                { timestamp, campaignName, location, url, source, image },
                { new: true, runValidators: true }
            );

            if (!updatedResult) {
                return res.status(404).json({ error: "Không tìm thấy result để cập nhật" });
            }

            return res.status(200).json(updatedResult);
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật result:", err);
            return res.status(500).json({ error: "Lỗi server khi cập nhật result" });
        }
    },

    deleteResult: async (req, res) => {
        try {
            const deletedResult = await Result.findByIdAndDelete(req.params.id);
            if (!deletedResult) {
                return res.status(404).json({ error: "Không tìm thấy result để xóa" });
            }
            return res.status(200).json({ message: "Đã xóa result thành công" });
        } catch (err) {
            console.error("❌ Lỗi khi xóa result:", err);
            return res.status(500).json({ error: "Lỗi server khi xóa result" });
        }
    }
};

module.exports = resultController;
