import { CardModel } from "hearthstone-core";
import { SpellCardView } from "./spell";
import { MinionCardView } from "./minion";
import { WeaponCardView } from "./weapon";
import React from "react";
import { MinionCardModel } from "hearthstone-core";
import { SpellCardModel } from "hearthstone-core";
import { WeaponCardModel } from "hearthstone-core";
import { useModel } from "../hooks/use-model";

export function CardView(props: {
    card?: CardModel
    index: number
}) {
    const { card } = props;
    const cost = useModel(card?.child.cost);

    const render = () => {
        if (card instanceof MinionCardModel) return <MinionCardView card={card} />;
        if (card instanceof SpellCardModel) return <SpellCardView card={card} />;
        if (card instanceof WeaponCardModel) return <WeaponCardView card={card} />;
        return null;
    }

    if (!card) return null;
    return <div className="flex border-b-2 p-1 gap-1 items-center w-[300px]">
        <span className="text-blue-300">{cost?.state.current}</span> 
        <span>{card.state.name}</span>
        {render()}
    </div>
}   