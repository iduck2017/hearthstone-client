import { WeaponCardModel } from "hearthstone-core";
import React from "react";
import { useModel } from "../hooks/use-model";
import { ICardView } from "./card";

export function WeaponCardView(props: {
    card?: WeaponCardModel
}) {
    const weapon = useModel(props?.card);
    const cost = useModel(weapon?.child.cost);
    const attack = useModel(weapon?.child.attack);
    const action = useModel(weapon?.child.action);
    return <ICardView card={props.card}>
        <div className="flex items-center">
            <span className="text-yellow-300">{attack?.state.current}</span>
            <span className="text-gray-200 text-sm">/</span>
            <span className="text-gray-500">{action?.state.current}</span>
        </div>
    </ICardView>
}