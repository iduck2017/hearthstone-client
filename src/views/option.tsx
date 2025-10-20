import { GameModel, AnimeUtil, PlayerType, AppModel } from "hearthstone-core";
import React, { useEffect, useRef, useState } from "react";
import { useModel } from "../hooks/use-model";
import { Popover } from "./popover";
import { Model } from "set-piece";
import { useOption } from "../hooks/use-option";

export function OptionView(props: {
    app?: AppModel
}) {
    const { options, setOptions } = useOption(props.app?.child.game);
    const plan = useRef<string[]>([]);

    const app = props.app;
    const game = app?.child.game;
    const turn = game?.child.turn;
    const current = turn?.refer.current;
    const isUser = current?.state.role === PlayerType.USER;


    useEffect(() => {
        if (!current) return;
        if (!app?.child.game) return;
        if (!isUser) {
            if (options.length === 1 && options[0]) {
                // only one option, just execute it
                options[0].handler();
                return;
            }
            if (plan.current.length > 0) {
                const code = plan.current.shift();
                const option = options.find(item => item.code === code);
                if (!option) {
                    console.log('invalid plan', code);
                    plan.current = [];
                    request(0);
                } else {
                    option.handler();
                }
            } else {
                request(0);
            }
        }
    }, [options])

    const request = (retry: number) => {
        console.log('waiting for ai decision...');
        if (retry) console.log('retry times:', retry);
        if (!current) return;
        const body: {
            player: string,
            snapshot: string,
            history: string,
            options: string,
        } = {
            player: current?.name,
            snapshot: JSON.stringify(game?.chunk),
            history: JSON.stringify(history),
            options: JSON.stringify(options),
        };
        fetch('http://localhost:8080/select-option', {
            method: 'POST',
            body: JSON.stringify(body),
        })
        .then(res => res.json())
        .then((data: {
            index?: number,
            plan?: string[],
            reason?: string,
            error?: string,
        }) => {
            if (data.error) {
                console.error('request error', data.error);
                if (retry < 3) {
                    request(retry + 1);
                }
                return;
            } else {
                const option = options[data.index ?? 0];
                if (!option) {
                    console.error('option not found');
                    if (retry < 3) {
                        request(retry + 1);
                    }
                    return;
                };
                plan.current = [...(data.plan ?? [])];
                option.handler();
            }
        })
    }


    return <div className="flex flex-col">
        <div className="flex-shrink-0">
            <h1 className="text-xl font-bold mb-2">Options</h1>
            <div className="font-bold mb-2 flex gap-2">
                <span className={`${turn?.refer.current === game?.child.playerA ? 'text-green-300 underline' : ''}`}>PlayerA</span>
                <span className="text-gray-300 font-normal text-sm">/</span>
                <span className={`${turn?.refer.current === game?.child.playerB ? 'text-green-300 underline' : ''}`}>PlayerB</span>
            </div>
            {!isUser ? <div className="mb-2">
                <span className="font-normal text-sm">waiting for agent decision...</span>
            </div> : null}
            <div className="mb-4">
                {options.map((item, index) => (
                    <div 
                        key={index} 
                        className={`mb-1 ${isUser ? 'text-blue-500 cursor-pointer hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
                        onClick={() => {
                            if (!isUser) return;
                            item.handler();
                        }}
                    >
                        <Popover
                            content={<div>{item.desc}</div>}
                            layout="right"
                        >
                            <span className="select-none">{index + 1}. {item.hint}</span>
                        </Popover>
                    </div>
                ))}
            </div>
        </div>
    </div>
}