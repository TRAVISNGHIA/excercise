import { formidable } from "formidable";
import fs from "fs";
import Papa from "papaparse";
import dbConnect from "../../db";
import Keyword from "../../models/Keyword";
import Location from "../../models/Location";
import Result from "../../models/Result";
import ResultLog from "../../models/ResultLog";
import UrlMatch from "../../models/UrlMatch";

export const config = {
    api: {
        bodyParser: false,
    },
};
const modelMap = {
    keyword: Keyword,
    location: Location,
    result: Result,
    resultlog: ResultLog,
    urlmatch: UrlMatch,
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = formidable({
        uploadDir: "./tmp",
        keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parse error:", err);
            return res.status(500).json({ error: "Error parsing form" });
        }

        const { type } = fields;
        const modelKey = type?.toString().toLowerCase();

        if (!modelKey || !modelMap[modelKey]) {
            return res.status(400).json({ error: "Invalid or missing 'type' field" });
        }

        const file = files.csvFile?.[0] || files.csvFile;
        if (!file || !file.filepath) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileContent = fs.readFileSync(file.filepath, "utf8");

        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: async (result) => {
                try {
                    await dbConnect();

                    const model = modelMap[modelKey];
                    const data = result.data;

                    const inserted = await model.insertMany(data, { ordered: false });

                    return res.status(200).json({
                        success: true,
                        message: `Imported ${inserted.length} records to ${modelKey}`,
                        data: inserted,
                    });
                } catch (saveError) {
                    console.error("DB save error:", saveError);
                    return res.status(500).json({ error: "Failed to save to database" });
                }
            },
        });
    });
}
