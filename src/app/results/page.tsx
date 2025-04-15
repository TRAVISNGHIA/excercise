"use client";

import ResultsTable from "../component/ResultsTable.js";

export default function ResultsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Table Results</h1>
            <ResultsTable/>
        </div>
    );
}
