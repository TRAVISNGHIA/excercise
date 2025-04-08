import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import dbConnect from "../../db";

// Models
import Keyword from "../../models/Keyword";
import UrlMatch from "../../models/UrlMatch";
import Result from "../../models/Result";
import ResultLog from "../../models/ResultLog";
import Location from "../../models/Location";

export const config = {
    api: {
        bodyParser: false,
    },
};

const MODEL_CONFIG = [
    {
        model: Keyword,
        condition: (row) => row.key,
        mapper: (row) => ({ key: row.key }),
    },
    {
        model: UrlMatch,
        condition: (row) => row.url && !row.key,
        mapper: (row) => ({ url: row.url }),
    },
    {
        model: Result,
        condition: (row) => row.timestamp && row.image && !row.brand,
        mapper: (row) => ({
            timestamp: row.timestamp,
            campaignName: row.campaignName,
            location: row.location,
            url: row.url,
            source: row.source,
            image: row.image,
        }),
    },
    {
        model: ResultLog,
        condition: (row) => row.timestamp && row.brand,
        mapper: (row) => ({
            timestamp: row.timestamp,
            brand: row.brand,
            location: row.location,
            url: row.url,
            source: row.source,
            image: row.image,
        }),
    },
    {
        model: Location,
        condition: (row) => row.encodedId,
        mapper: (row) => ({
            encodedId: row.encodedId,
            address: row.address,
        }),
    },
];

const importCSV = async (req, res) => {
    await dbConnect();

    const form = new IncomingForm();
    form.uploadDir = path.join(process.cwd(), "/tmp");
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).send("Lỗi khi tải file lên");

        const file = files.csvFile[0];
        const filePath = file.filepath;

        try {
            const fileContent = fs.readFileSync(filePath, "utf8");

            Papa.parse(fileContent, {
                header: true,
                complete: async ({ data }) => {
                    try {
                        for (const { model, condition, mapper } of MODEL_CONFIG) {
                            const docs = data.filter(condition).map(mapper);
                            if (docs.length) {
                                await model.insertMany(docs, { ordered: false });
                            }
                        }
                    } catch (insertErr) {
                        if (insertErr.code === 11000 || insertErr.name === "MongoBulkWriteError") {
                            console.warn("⚠️ Một số bản ghi trùng đã bị bỏ qua.");
                        } else {
                            console.error("❌ Lỗi insert:", insertErr);
                            return res.status(500).json({ message: "Lỗi khi insert dữ liệu." });
                        }
                    } finally {
                        fs.unlinkSync(filePath);
                    }

                    res.status(200).json({ message: "Import CSV thành công!" });
                },
            });
        } catch (err) {
            console.error("Lỗi xử lý CSV:", err);
            res.status(500).send("Lỗi khi xử lý file CSV");
        }
    });
};

export default importCSV;
