"use client";

import ResultLogsTable from "../component/ResultLogsTable";

export default function ResultLogsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Table Logs</h1>
            <ResultLogsTable/>
        </div>
    );
}