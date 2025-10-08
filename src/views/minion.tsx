import { MinionCardModel } from "hearthstone-core";
import React from "react";
import { useModel } from "../hooks/use-model";

export function MinionCardView(props: {
    card?: MinionCardModel
}) {    
    const minion = useModel(props?.card);
    const health = useModel(minion?.child.role.child.health);
    const attack = useModel(minion?.child.role.child.attack);
    return <div className="flex items-center">
        <span className="text-yellow-300">{attack?.state.current}</span>
        <span className="text-gray-200 text-sm">/</span>
        <span className="text-red-300">{health?.state.current}</span>
    </div>
}