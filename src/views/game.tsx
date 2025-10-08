import { GameModel } from "hearthstone-core"
import React from "react";
import { useModel } from "../hooks/use-model";
import { BoardView } from "./board";
import { DeckView } from "./deck";
import { HandView } from "./hand";
import { PlayerView } from "./player";
import { GraveyardView } from "./graveyard";

export default function GameView(props: {
    game?: GameModel
}) {
    const game = useModel(props?.game);
    const playerA = useModel(game?.child.playerA);
    const playerB = useModel(game?.child.playerB);
    const turn = useModel(game?.child.turn);

    return <div className="p-4 w-max">
        <h1 className="text-2xl font-bold mb-6">Game</h1>
        <div className="flex gap-4 flex-nowrap">
            <PlayerView player={game?.child.playerA} current={turn?.refer.current} name="PlayerA" />
            <PlayerView player={game?.child.playerB} current={turn?.refer.current} name="PlayerB" />
        </div>
        <div className="flex gap-4 mb-4 min-h-[200px] flex-nowrap">
            <HandView hand={playerA?.child.hand} />
            <BoardView board={playerA?.child.board} />
            <BoardView board={playerB?.child.board} />
            <HandView hand={playerB?.child.hand} />
        </div>
        <div className="flex gap-4 flex-nowrap mb-4">
            <GraveyardView graveyard={playerA?.child.graveyard} />
            <GraveyardView graveyard={playerB?.child.graveyard} />
        </div>
        <div className="flex gap-4 flex-nowrap">
            <DeckView deck={playerA?.child.deck} />
            <DeckView deck={playerB?.child.deck} />
        </div>
    </div>
}