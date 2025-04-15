"use client";

import KeywordsTable from "./component/KeyWordsTable";

export default function KeywordsPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Table Keywords</h1>
            <KeywordsTable/>
        </div>
    );
}