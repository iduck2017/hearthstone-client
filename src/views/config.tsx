import { ConfigModel } from "hearthstone-core"
import React from "react";
import { useModel } from "../hooks/use-model";
import { CardView } from "./card";

export function ConfigView(props: {
    config?: ConfigModel
    index: number
}) {
    const config = useModel(props?.config);
    return <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">Config-{props.index + 1}</span>
            <div className="flex gap-1">
                <button className="text-blue-500 text-xs hover:underline">use</button>
                <button className="text-red-500 text-xs hover:underline">delete</button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
            {config?.child.cards.map((item, index) => (
                <CardView key={index} card={item} index={index} />
            ))}
        </div>
    </div>
}