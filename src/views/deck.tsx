import { DeckModel } from "hearthstone-core"
import { useModel } from "../hooks/use-model";
import { CardView } from "./card";
import React from "react";

export function DeckView(props: {
    deck?: DeckModel
}) {
    const deck = useModel(props?.deck);
    return <div>
        <h1 className="text-lg font-bold">Deck</h1>
        <div className="grid grid-cols-2 gap-2">
            {deck?.refer.order.map((item, index) => (
                <CardView key={index} card={item} index={index} />
            ))}
        </div>
    </div>
}