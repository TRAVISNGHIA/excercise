"use client";

import ResultsTable from "../component/ResultsTable.js";

export default function ResultsPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Results Management</h1>
            <ResultsTable />
        </div>
    );
}
