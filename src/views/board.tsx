import { BoardModel, CardModel } from "hearthstone-core"
import { useModel } from "../hooks/use-model";
import React from "react";
import { PlayerView } from "./player";
import { CardView } from "./card";

export function BoardView(props: {
    board?: BoardModel
}) {
    const board = useModel(props?.board);
    return <div className="flex flex-col w-[300px]">
        <h1 className="text-lg font-bold mb-2">Board</h1>
        {board?.refer.queue.map((item, index) => (
            <CardView key={item.uuid} card={item} index={index} />
        ))}
    </div>
}