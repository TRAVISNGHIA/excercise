import formidable from "formidable";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { dbConnect } from "../../db";

export const config = {
    api: {
        bodyParser: false,
    },
};

const importCSV = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), "/tmp");
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).send("Lỗi khi tải file lên");

        const file = files.csvFile[0]; // Lấy file từ form
        const filePath = file.filepath;

        try {

            const fileContent = fs.readFileSync(filePath, "utf8");


            Papa.parse(fileContent, {
                complete: async (result) => {
                    const { db } = await connectToDatabase(); // Kết nối đến database

                    const keywords = result.data.map((row) => ({
                        key: row.key, // Giả sử dữ liệu trong CSV có trường "key"
                    }));


                    await db.collection("keywords").insertMany(keywords);


                    fs.unlinkSync(filePath);

                    res.status(200).json({ message: "CSV đã được import thành công!" });
                },
                header: true, // Đảm bảo dữ liệu trong CSV có header
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Lỗi khi xử lý file CSV");
        }
    });
};

export default importCSV;
