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
            {deck?.refer.queue.map((item, index) => (
                <CardView key={item.uuid} card={item} index={index} />
            ))}
        </div>
    </div>
}