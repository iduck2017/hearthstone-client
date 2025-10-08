import { WeaponCardModel } from "hearthstone-core";
import React from "react";
import { useModel } from "../hooks/use-model";

export function WeaponCardView(props: {
    card?: WeaponCardModel
}) {
    const weapon = useModel(props?.card);
    const cost = useModel(weapon?.child.cost);
    const attack = useModel(weapon?.child.attack);
    const action = useModel(weapon?.child.action);
    return <div>
        {cost?.state.current}
        {attack?.state.current}/
        {action?.state.current}
    </div>
}