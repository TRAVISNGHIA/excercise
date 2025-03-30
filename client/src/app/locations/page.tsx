"use client";

import LocationsTable from "../../app/component/LocationsTable";

export default function LocationsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bảng Địa Điểm</h1>
            <LocationsTable/>
        </div>
    );
}