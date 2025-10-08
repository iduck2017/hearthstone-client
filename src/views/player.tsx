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

    return <div className={`flex gap-2 w-[616px] items-center`}>
        <h1 className="text-lg font-bold">
            {props.name}
            {props.current === props.player && <span className="text-red-500">*</span>}
        </h1>
        <span className="text-blue-500">{mana?.state.current}/{mana?.state.origin}</span>
    </div>
}   