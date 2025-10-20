import React, { useEffect, useState } from "react";
import { DebugUtil } from "set-piece";

export function HistoryView() {
    const [history, setHistory] = useState<string[]>([]);

    const refresh = () => {
        setHistory(DebugUtil.stack.slice(-20));
    }
    useEffect(() => {
        window.addEventListener('click', () => {
            setTimeout(() => refresh());
        });
        refresh();
    }, []);

    return <div className="overflow-y-auto">
        <h1 className="text-xl font-bold mb-2 cursor-pointer" onClick={() => refresh()}>History</h1>
        <div className="mb-4 text-sm">
            {history.map((item, index) => (
                <div key={index}>{item}</div>
            ))}
        </div>
    </div>
}