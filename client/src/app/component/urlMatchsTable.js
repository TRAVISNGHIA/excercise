"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/urlMatchs/data-table";
import { columns } from "@/app/urlMatchs/columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UrlMatchTable() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({ url: "" });
    const API_URL = "http://localhost:3000/api/urlMatchs";

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            // Sửa chỗ này: Kiểm tra cấu trúc phản hồi và đặt dữ liệu đúng cách
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
            fetchData();
            setIsModalOpen(false);
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

    // Thêm hàm xử lý sự kiện chỉnh sửa
    const handleEdit = (row) => {
        setEditingData({ _id: row._id, url: row.url });
        setIsModalOpen(true);
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex justify-between mb-4">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingData({ url: "" }); setIsModalOpen(true); }}>Thêm mới</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingData?._id ? "Chỉnh sửa" : "Thêm mới"}</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder="URL"
                            value={editingData.url}
                            onChange={(e) => setEditingData({ ...editingData, url: e.target.value })}
                        />
                        <Button onClick={handleSave}>Lưu</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={[
                    ...columns,
                    { id: "actions",
                        cell: ({ row }) => <Button size="sm" onClick={() => { setEditingData(row.original); setIsModalOpen(true); }}>Sửa</Button> }
                ]}
                data={data}
                onDelete={handleDelete}
            />
        </div>
    );
}