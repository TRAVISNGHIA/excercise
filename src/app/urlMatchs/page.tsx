"use client";

import UrlMatchTable from "../component/urlMatchsTable";

export default function UrlMatchPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bảng URL</h1>
            <UrlMatchTable/>
        </div>
    );
}