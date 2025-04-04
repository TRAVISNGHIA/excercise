"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/resultLogs/data-table";
import { columns } from "@/app/resultLogs/columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {exportToCSV} from "../../../utils/exportUtils";

export default function ResultLogsTable() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({});
    const API_URL = "https://excercise-duu9.onrender.com/api/resultLogs";

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setData(res.data);
        } catch {
            toast.error("Lỗi khi tải dữ liệu!");
        }
    };

    const handleRequest = async (method, payload = {}, id = null) => {
        let url = API_URL;
        if (method === "put" && id) {
            url += `?id=${id}`;
        }
        try {
            await axios({ method, url, data: payload });
            toast.success(method === "delete" ? "Xóa thành công!" : "Lưu thành công!");
            fetchData();
            setIsModalOpen(false);
        } catch {
            toast.error("Lỗi xử lý dữ liệu!");
        }
    };

    const handleSave = () => {
        if (!editingData.timestamp || !editingData.brand || !editingData.location || !editingData.url || !editingData.source) {
            return toast.error("Vui lòng nhập đầy đủ thông tin!");
        }
        if (editingData._id) {
            const id = editingData._id;
            const updatedData = { ...editingData };
            delete updatedData._id;
            handleRequest("put", updatedData, id);
        } else {
            handleRequest("post", editingData);
        }
    };
    const handleDelete = (selectedRows) => {
        if (!selectedRows.length) return toast.error("Chọn ít nhất một mục!");
        handleRequest("delete", { ids: selectedRows.map(row => row._id) });
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingData({}); setIsModalOpen(true); }}>Thêm mới</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingData?._id ? "Chỉnh sửa" : "Thêm mới"}</DialogTitle>
                        </DialogHeader>
                        {["timestamp", "brand", "location", "url", "source", "image"].map((field) => (
                            <Input key={field} placeholder={field} value={editingData?.[field] || ""}
                                   onChange={(e) => setEditingData({ ...editingData, [field]: e.target.value })} />
                        ))}
                        <Button onClick={handleSave}>Lưu</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex gap-2 mb-4">
                <button onClick={() => exportToCSV(data)} className="bg-black text-white px-4 py-1 rounded">
                    Xuất CSV
                </button>
            </div>
            <DataTable
                columns={[
                    ...columns,
                    { id: "actions",
                        cell: ({ row }) => <Button size="sm" onClick={() => { setEditingData(row.original); setIsModalOpen(true); }}>Sửa</Button> }
                ]}
                data={data}
                onDelete={handleDelete}
                className="table-auto w-full border-collapse"
                cellClassName="px-4 py-2 border-b"
                headerClassName="text-left px-4 py-2 bg-gray-100 border-b"
            />
        </div>
    );
}
