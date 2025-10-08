import { GraveyardModel } from "hearthstone-core"
import { useModel } from "../hooks/use-model";
import { CardView } from "./card";
import React from "react";

export function GraveyardView(props: {
    graveyard?: GraveyardModel
}) {
    const graveyard = useModel(props?.graveyard);
    const cards = graveyard ? [
        ...graveyard.child.minions,
        ...graveyard.child.spells,
        ...graveyard.child.weapons,
    ] : [];
    return <div className="flex flex-col w-[608px]">
        <h1 className="text-lg font-bold">Graveyard</h1>
        <div className="grid grid-cols-2 gap-2">
            {cards.map((item, index) => (
                <CardView key={item.uuid} card={item} index={index} />
            ))}
        </div>
    </div>
}