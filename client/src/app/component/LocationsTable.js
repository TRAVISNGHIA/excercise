"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/locations/data-table";
import { columns } from "@/app/locations/columns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LocationsTable() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState({});
    const API_URL = "http://localhost:3000/api/locations";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setData(res.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error.response?.data || error.message);
            toast.error("Lỗi khi tải dữ liệu!");
        }
    };

    const handleRequest = async (method, payload = {}, id = null) => {
        try {
            console.log(`Sending ${method.toUpperCase()} request with:`, { method, payload, id });

            if (method === "put" && id) {
                const url = `${API_URL}/${id}`;
                console.log("PUT URL:", url);
                const response = await axios.put(url, payload);
                console.log("PUT Response:", response.data);
            } else if (method === "post") {
                await axios.post(API_URL, payload);
            } else {
                console.error("Invalid method or missing ID for PUT");
                return toast.error("Lỗi cấu hình request!");
            }

            toast.success(method === "put" ? "Cập nhật thành công!" : "Thêm mới thành công!");
            fetchData(); // Refresh data after successful operation
            setIsModalOpen(false);
        } catch (error) {
            console.error("API Error:", error.response?.data || error);
            toast.error(`Lỗi xử lý dữ liệu: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleSave = () => {
        if (!editingData.encodedId || !editingData.address) {
            return toast.error("Vui lòng nhập đầy đủ thông tin!");
        }

        if (editingData._id) {
            // Cập nhật - gửi đúng ID như một phần của URL
            handleRequest("put", editingData, editingData._id);
        } else {
            // Thêm mới
            handleRequest("post", editingData);
        }
    };

    const handleDelete = async (selectedRows) => {
        if (selectedRows.length > 0) {
            try {
                await axios.delete(API_URL, {
                    data: { ids: selectedRows },
                });
                toast.success(`Xóa thành công ${selectedRows.length} mục!`);
                fetchData(); // Cập nhật dữ liệu sau khi xóa
            } catch (error) {
                console.error("Delete error:", error.response?.data || error);
                toast.error("Lỗi khi xóa dữ liệu!");
            }
        }
    };

    const handleEdit = (rowData) => {
        setEditingData(rowData);
        setIsModalOpen(true);
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
                        {["encodedId", "address"].map((field) => (
                            <Input
                                key={field}
                                placeholder={field === "encodedId" ? "Mã định danh" : "Địa chỉ"}
                                value={editingData?.[field] || ""}
                                onChange={(e) => setEditingData({ ...editingData, [field]: e.target.value })}
                            />
                        ))}
                        <Button onClick={handleSave}>Lưu</Button>
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable
                columns={[
                    ...columns,
                    {
                        id: "actions",
                        cell: ({ row }) => (
                            <Button size="sm" onClick={() => handleEdit(row.original)}>Sửa</Button>
                        ),
                    },
                ]}
                data={data}
                onDelete={handleDelete} // Pass handleDelete to DataTable
            />
        </div>
    );
}
