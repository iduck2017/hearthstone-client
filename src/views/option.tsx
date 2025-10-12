import { Option, GameModel, AnimeUtil } from "hearthstone-core";
import React, { useEffect, useState } from "react";
import { useModel } from "../hooks/use-model";
import { Popover } from "./popover";

export function OptionView(props: {
    game?: GameModel
}) {
    const [options, setOptions] = useState<Option[]>([]);
    const game = useModel(props.game);
    const turn = useModel(game?.child.turn);

    const refresh = () => {
        if (!turn) return;
        const current = turn.refer.current;
        if (!current) return;
        setOptions(current.options);
    }

    useEffect(() => {
        refresh();
    }, [turn]);

    return <div>
        <h1 className="text-2xl font-bold mb-2">Commands</h1>
        <div className="font-bold mb-2 flex gap-2">
            <span className={`${turn?.refer.current === game?.child.playerA ? 'text-green-300 underline' : ''}`}>PlayerA</span>
            <span className="text-gray-300 font-normal text-sm">/</span>
            <span className={`${turn?.refer.current === game?.child.playerB ? 'text-green-300 underline' : ''}`}>PlayerB</span>
        </div>
        {options.map((item, index) => (
            <div 
                key={index} 
                className="text-blue-500 hover:underline cursor-pointer mb-1 select-none"
                onClick={() => {
                    AnimeUtil.reset();
                    item.handler();
                    setTimeout(() => refresh());
                }}
            >
                {item.desc ? 
                    <Popover layout="right" content={item.desc}>
                        {item.title}
                    </Popover> : 
                    item.title
                }
            </div>
        ))}
    </div>
}