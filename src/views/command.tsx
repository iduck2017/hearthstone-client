import { CommandUtil, GameModel } from "hearthstone-core";
import React, { useEffect, useState } from "react";
import { useModel } from "../hooks/use-model";

export function CommandView(props: {
    game?: GameModel
}) {
    const [command, setCommand] = useState<CommandUtil[]>([]);
    const game = useModel(props.game);
    const turn = useModel(game?.child.turn);

    const refresh = () => {
        if (!turn) return;
        const current = turn.refer.current;
        if (!current) return;
        console.log(current.command);
        setCommand(current.command);
    }

    useEffect(() => {
        refresh();
    }, [turn]);

    return <div>
        <h1 className="text-2xl font-bold mb-2">Commands</h1>
        {command.map((item, index) => (
            <div 
                key={index} 
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => item.handler()}
            >
                {item.title}
            </div>
        ))}
    </div>
}