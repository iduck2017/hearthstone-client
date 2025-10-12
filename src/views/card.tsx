import { CardModel, RarityType } from "hearthstone-core";
import { SpellCardView } from "./spell";
import { MinionCardView } from "./minion";
import { WeaponCardView } from "./weapon";
import React from "react";
import { MinionCardModel } from "hearthstone-core";
import { SpellCardModel } from "hearthstone-core";
import { WeaponCardModel } from "hearthstone-core";
import { useModel } from "../hooks/use-model";
import { func } from "joi";
import { Popover } from "./popover";

export function CardView(props: {
    card?: CardModel
    index: number
}) {
    const { card } = props;
    if (card instanceof MinionCardModel) return <MinionCardView card={card} />;
    if (card instanceof SpellCardModel) return <SpellCardView card={card} />;
    if (card instanceof WeaponCardModel) return <WeaponCardView card={card} />;
}  

export function ICardView(props: {
    card?: CardModel
    children?: React.ReactNode
    className?: string
}) {
    const card = useModel(props.card);
    const cost = useModel(props.card?.child.cost);
    return <Popover
        content={props.card?.state.desc}
    >
        <div 
            onClick={() => console.log(props.card)}
            className={`flex border-b-2 p-1 gap-1 items-center w-[300px] ${props.className}`}
        >
            <span className="text-blue-300">{cost?.state.current}</span> 
            <span className={`${card?.state.rarity === RarityType.LEGENDARY ? 'font-bold' : ''}`}>
                {card?.state.name}
            </span>
            {props.children}
        </div>
    </Popover>
}