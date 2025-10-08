import { MinionCardModel } from "hearthstone-core";
import React from "react";
import { useModel } from "../hooks/use-model";
import { ICardView } from "./card";

export function MinionCardView(props: {
    card?: MinionCardModel
}) {    
    const minion = useModel(props?.card);
    const health = useModel(minion?.child.role.child.health);
    const attack = useModel(minion?.child.role.child.attack);
    const role = useModel(minion?.child.role);
    const cardFeats = useModel(minion?.child.feats);
    const roleFeats = useModel(role?.child.feats);
    const divineShield = useModel(roleFeats?.child.divineShield);
    const taunt = useModel(roleFeats?.child.taunt);
    const stealth = useModel(roleFeats?.child.stealth);
    const windfury = useModel(roleFeats?.child.windfury);
    const poisonous = useModel(cardFeats?.child.poisonous);
    const action = useModel(role?.child.action);

    return <ICardView 
        card={props.card}
        className={`
            ${divineShield?.state.isActive ? 'text-yellow-300' : ''}  
            ${stealth?.state.isActive ? 'text-gray-300' : ''}  
            ${role?.child.action.status ? 'text-green-300' : ''}  
        `}
    >
        <div className="flex items-center">
            <span className="text-yellow-300">{attack?.state.current}</span>
            <span className="text-gray-200 text-sm">/</span>
            {health ? <span 
                className={`${health?.state.current < health.state.maximum ? 'text-red-300' : 'text-green-300'}`}
            >{health?.state.current}</span> : null}
        </div>
        <div className="flex gap-1 ml-auto mr-1">
            {cardFeats?.child.battlecry.length ? <span>🔥</span> : null}
            {cardFeats?.child.deathrattle.length ? <span>💀</span> : null}
            {cardFeats?.child.startTurn.length || cardFeats?.child.endTurn.length ? 
                <span>⏳</span> : null}
            {poisonous?.state.isActive ? <span>🦠</span> : null}
            {windfury?.state.isActive ? <span>🪽</span> : null}
            {taunt?.state.isActive && !stealth?.state.isActive ? <span>🛡</span> : null}
        </div>
    </ICardView>
}