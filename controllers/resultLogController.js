const ResultLog = require("../models/resultLogs");

const resultLogController = {

    getAllLogs: async (req, res) => {
        try {
            const logs = await ResultLog.find().populate("brand location source");
            return res.status(200).json(logs);
        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getLogById: async (req, res) => {
        try {
            const log = await ResultLog.findById(req.params.id).populate("brand location source");
            if (!log) {
                return res.status(404).json({ error: "Không tìm thấy log" });
            }
            return res.status(200).json(log);
        } catch (err) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createLog: async (req, res) => {
        try {
            const { timestamp, brand, location, url, source, image } = req.body;
            if (!timestamp || !brand || !location || !url || !source || !image) {
                return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
            }

            const newLog = new ResultLog({ timestamp, brand, location, url, source, image });
            const savedLog = await newLog.save();
            return res.status(201).json(savedLog);
        } catch (err) {
            return res.status(500).json({ error: "Lỗi server khi tạo log" });
        }
    },

    updateLog: async (req, res) => {
        try {
            const { timestamp, brand, location, url, source, image } = req.body;

            const updatedLog = await ResultLog.findByIdAndUpdate(
                req.params.id,
                { timestamp, brand, location, url, source, image },
                { new: true, runValidators: true }
            );

            if (!updatedLog) {
                return res.status(404).json({ error: "Không tìm thấy log để cập nhật" });
            }

            return res.status(200).json(updatedLog);
        } catch (err) {
            return res.status(500).json({ error: "Lỗi server khi cập nhật log" });
        }
    },

    deleteLog: async (req, res) => {
        try {
            const deletedLog = await ResultLog.findByIdAndDelete(req.params.id);
            if (!deletedLog) {
                return res.status(404).json({ error: "Không tìm thấy log để xóa" });
            }
            return res.status(200).json({ message: "Đã xóa log thành công" });
        } catch (err) {
            return res.status(500).json({ error: "Lỗi server khi xóa log" });
        }
    }
};

module.exports = resultLogController;
