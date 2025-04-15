"use client";

import {  useRef,useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/urlMatchs/data-table";
import { columns } from "@/app/urlMatchs/columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UrlMatchTable() {
    const [csvFile, setCsvFile] = useState(null);
    const [data, setData] = useState([]);
    const [fileError, setFileError] = useState(false);
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({ url: "" });
    const API_URL = "https://excercise-duu9.onrender.com/api/urlMatchs";

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setData(Array.isArray(res.data) ? res.data : (res.data.data || []));
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            toast.error("Lỗi khi tải dữ liệu!");
        }
    };

    const handleRequest = async (method, payload = {}, id = null) => {
        let url = API_URL;
        if (id) url += `?id=${id}`;

        try {
            await axios({ method, url, data: payload });
            toast.success(method === "delete" ? "Xóa thành công!" : "Lưu thành công!");
            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi xử lý dữ liệu:", error);
            toast.error("Lỗi xử lý dữ liệu!");
        }
    };

    const handleSave = () => {
        if (!editingData.url) {
            return toast.error("Vui lòng nhập URL!");
        }
        if (editingData._id) {
            handleRequest("put", { url: editingData.url }, editingData._id);
        } else {
            handleRequest("post", { url: editingData.url });
        }
    };

    const handleDelete = (selectedRows) => {
        if (!selectedRows.length) return toast.error("Chọn ít nhất một mục!");
        Promise.all(selectedRows.map(id => handleRequest("delete", {}, id)))
            .then(() => fetchData());
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "text/csv") {
            setCsvFile(file);
            setFileError(false);
        } else {
            setCsvFile(null);
            setFileError(true);
        }
    };

    const handleFileUpload = async () => {
        if (!csvFile) {
            setFileError(true);
            fileInputRef.current?.focus(); // đưa con trỏ vào input
            return;
        }
        const formData = new FormData();
        formData.append("csvFile", csvFile);
        formData.append("type", "urlmatch");

        try {
            const res = await axios.post("/api/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Import CSV thành công!");
            window.location.reload();
        } catch (error) {
            toast.error("Lỗi khi tải file CSV lên!");
        }
    };
    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center gap-4 mb-4">
                <div className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className={`px-4 py-1 rounded border ${fileError ? "border-red-500" : "border-gray-300"}`}
                    />
                    <Button onClick={handleFileUpload}>Import CSV</Button>
                </div>

                <Dialog
                    open={isModalOpen}
                    onOpenChange={(open) => {
                        setIsModalOpen(open);
                        if (!open) setEditingData({});
                    }}
                >
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingData({}); setIsModalOpen(true); }}>
                            add new
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingData?._id ? "Chỉnh sửa" : "Thêm mới"}</DialogTitle>
                        </DialogHeader>
                        {["encodedId", "address"].map((field) => (
                            <Input
                                key={field}
                                placeholder={field}
                                value={editingData?.[field] || ""}
                                onChange={(e) =>
                                    setEditingData({ ...editingData, [field]: e.target.value })
                                }
                            />
                        ))}
                        <Button onClick={handleSave}>save</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto">
                <div className="max-h-[500px] overflow-y-auto border rounded">
            <DataTable
                columns={[
                    ...columns,
                    { id: "actions",
                        cell: ({ row }) =>
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                onClick={() => { setEditingData(row.original); setIsModalOpen(true); }}
                            >
                                Sửa
                            </Button>
                        </div>
                    }
                ]}
                data={data}
                onDelete={handleDelete}
            />
                </div>
            </div>
        </div>
    );
}