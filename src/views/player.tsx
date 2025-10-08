import { PlayerModel } from "hearthstone-core"
import React from "react";
import { useModel } from "../hooks/use-model";
import { BoardView } from "./board";
import { DeckView } from "./deck";

export function PlayerView(props: {
    player?: PlayerModel,
    current?: PlayerModel,
    name?: string
}) {
    const player = useModel(props?.player);
    const mana = useModel(player?.child.mana);
    const hero = useModel(player?.child.hero);
    const role = useModel(hero?.child.role);
    const health = useModel(role?.child.health);
    const attack = useModel(role?.child.attack);

    return <div className={`flex gap-2 w-[616px] items-center mb-4`}>
        <h1 className={`text-lg font-bold ${props.current === props.player ? 'text-green-300' : ''}`}>
            {props.name}
        </h1>
        <div className="flex">
            <span className="text-yellow-300">{attack?.state.current}</span>
            <span className="text-gray-200 text-sm">/</span>
            <span className="text-red-300">{health?.state.current}</span>
        </div>
        <span className="text-blue-500">{mana?.state.current}/{mana?.state.origin}</span>
    </div>
}   