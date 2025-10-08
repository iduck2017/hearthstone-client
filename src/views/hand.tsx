import { BoardModel, CardModel, HandModel } from "hearthstone-core"
import { useModel } from "../hooks/use-model";
import React from "react";
import { PlayerView } from "./player";
import { CardView } from "./card";

export function HandView(props: {
    hand?: HandModel
}) {
    const hand = useModel(props?.hand);
    return <div className="flex flex-col w-[300px]">
        <h1 className="text-lg font-bold mb-2">Hand</h1>
        {hand?.refer.order.map((item, index) => (
            <CardView key={item.uuid} card={item} index={index} />
        ))}
    </div>
}