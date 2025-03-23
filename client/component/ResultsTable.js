"use client";

import { useEffect, useState, useMemo } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styles from "../src/app/style.css"


dayjs.extend(customParseFormat);

const ResultsTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRows, setSelectedRows] = useState(new Set()); // Lưu id các hàng đã chọn
    const [datetimeFilter, setDatetimeFilter] = useState("");
    const [campaignFilter, setCampaignFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [newData, setNewData] = useState({ timestamp: "", campaignName: "", location: "", url: "", source: "", image: "" });
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get("http://localhost:3000/api/results")
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data);
            })
            .catch((error) => console.error("Error fetching results:", error));
    };

    const handleFilter = () => {
        const filtered = data.filter((item) => {
            const itemDate = dayjs(item.timestamp, "DD-MM-YYYY hh:mm:ss A").format("DD-MM-YYYY hh:mm:ss A");
            const dateMatches = datetimeFilter ? itemDate.includes(datetimeFilter) : true;
            const campaignMatches = campaignFilter ? item.campaignName?.toLowerCase().includes(campaignFilter.toLowerCase()) : true;
            const locationMatches = locationFilter ? item.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
            return dateMatches && campaignMatches && locationMatches;
        });
        setFilteredData(filtered);
    };

    const handleAddNew = () => {
        axios.post("http://localhost:3000/api/results", newData)
            .then(response => {
                setData([...data, response.data]);
                setFilteredData([...filteredData, response.data]);
                setShowModal(false);
                setNewData({ timestamp: "", campaignName: "", location: "", url: "", source: "", image: "" });
            })
            .catch(error => console.error("Error adding data:", error));
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prev) => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleDeleteSelected = () => {
        if (selectedRows.size === 0) return;

        const idsToDelete = Array.from(selectedRows);
        axios
            .delete("http://localhost:3000/api/results", { data: { ids: idsToDelete } })
            .then(() => {
                setData(data.filter((item) => !selectedRows.has(item._id)));
                setFilteredData(filteredData.filter((item) => !selectedRows.has(item._id)));
                setSelectedRows(new Set());
            })
            .catch((error) => console.error("Error deleting data:", error));
    };
    const columns = useMemo(
        () => [
            { header: "Datetime", accessorKey: "timestamp" },
            { header: "Campaign Name", accessorKey: "campaignName" },
            { header: "Location", accessorKey: "location" },
            { header: "URL", accessorKey: "url" },
            { header: "Source", accessorKey: "source" },
            { header: "Image", accessorKey: "image", cell: ({ getValue }) => <img src={getValue()} alt="Ad" width={50} /> },
        ],
        []
    );
    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <div className="mb-4 flex gap-4 flex-wrap">
                <input type="text" placeholder="Search Datetime..." value={datetimeFilter} onChange={(e) => setDatetimeFilter(e.target.value)} className="p-2 border rounded" />
                <input type="text" placeholder="Search Campaign Name..." value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)} className="p-2 border rounded" />
                <input type="text" placeholder="Search Location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="p-2 border rounded" />
                <button onClick={handleFilter} className="p-2 bg-blue-500 text-white rounded">Filter</button>
                <button className="p-2 bg-green-500 text-white rounded" onClick={() => setShowModal(true)}>Add New</button>
                <button
                    onClick={handleDeleteSelected}
                    className={`p-2 rounded ${selectedRows.size > 0 ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    disabled={selectedRows.size === 0}
                >
                    Delete Selected
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Add New Data</h2>
                        {Object.keys(newData).map((key) => (
                            <input
                                key={key}
                                type="text"
                                placeholder={key}
                                value={newData[key]}
                                onChange={(e) => setNewData({ ...newData, [key]: e.target.value })}
                                className="input-field"
                            />
                        ))}
                        <div className="modal-actions">
                            <button onClick={handleAddNew} className="btn-save">
                                Save
                            </button>
                            <button onClick={() => setShowModal(false)} className="btn-cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="border p-2 text-center">
                        <input
                            type="checkbox"
                            checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                            onChange={() => {
                                if (selectedRows.size === filteredData.length) {
                                    setSelectedRows(new Set());
                                } else {
                                    setSelectedRows(new Set(filteredData.map((row) => row._id)));
                                }
                            }}
                        />
                    </th>
                    <th className="border p-2">Datetime</th>
                    <th className="border p-2">Campaign Name</th>
                    <th className="border p-2">Location</th>
                    <th className="border p-2">URL</th>
                    <th className="border p-2">Source</th>
                    <th className="border p-2">Image</th>
                </tr>
                </thead>
                <tbody>
                {filteredData.map((row) => (
                    <tr key={row._id} className={selectedRows.has(row._id) ? "bg-gray-200" : ""}>
                        <td className="border p-2 text-center">
                            <input
                                type="checkbox"
                                checked={selectedRows.has(row._id)}
                                onChange={() => handleSelectRow(row._id)}
                            />
                        </td>
                        <td className="border p-2">{row.timestamp}</td>
                        <td className="border p-2">{row.campaignName}</td>
                        <td className="border p-2">{row.location}</td>
                        <td className="border p-2">{row.url}</td>
                        <td className="border p-2">{row.source}</td>
                        <td className="border p-2"><img src={row.image} alt="Ad" width={50} /></td>
                    </tr>
                ))}
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
