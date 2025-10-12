import React from "react";

export type History = {
    title: string;
    desc?: string;
    reason?: string;
    plan?: string;
    code: string;
}

export function HistoryView(props: {
    history?: History[]
}) {
    const debug = (item: History) => {
        if (item.reason) console.log('reason', item.reason);
        if (item.plan) console.log('plan', item.plan);
    }

    return <div className="h-full overflow-y-auto">
        <h1 className="text-xl font-bold mb-2">History</h1>
        <div className="mb-4 text-sm">
            {props.history?.map((item, index) => (
                <div key={index} onClick={() => debug(item)}>
                    <span>{index + 1}. {item.title}</span>
                </div>
            ))}
        </div>
    </div>
}