"use client";

import ResultLogsTable from "../../app/component/ResultLogsTable";

export default function ResultLogsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bảng Kết Quả Logs</h1>
            <ResultLogsTable/>
        </div>
    );
}