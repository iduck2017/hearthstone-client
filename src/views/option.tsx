import { Option, GameModel, AnimeUtil, PlayerType, AppModel } from "hearthstone-core";
import React, { useEffect, useRef, useState } from "react";
import { useModel } from "../hooks/use-model";
import { Popover } from "./popover";
import { History, HistoryView } from "./history";
import { Model } from "set-piece";

export function OptionView(props: {
    app?: AppModel
}) {
    const [options, setOptions] = useState<Option[]>([]);
    const [history, setHistory] = useState<History[]>([]);
    const plan = useRef<string[]>([]);

    const app = props.app;
    const game = app?.child.game;
    const turn = game?.child.turn;
    const current = turn?.refer.current;
    const isUser = current?.state.role === PlayerType.USER;

    const debug = () => {
        console.log(game?.chunk);
    }

    const execute = (option: Option, reason?: string) => {
        setHistory(prev => [...prev, {
            title: option.title,
            code: option.code,
            reason: reason,
        }]);
        AnimeUtil.reset();
        option.handler();
        setTimeout(() => refresh());
    }

    const refresh = () => {
        if (!turn) return;
        const current = turn.refer.current;
        if (!current) return;
        setOptions(current.options);
    }

    useEffect(() => {
        if (!current) return;
        if (!app?.child.game) return;
        if (!isUser) {
            if (options.length === 1 && options[0]) {
                // only one option, just execute it
                execute(options[0]);
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
                    execute(option);
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
                console.log(option?.title, data.plan)
                if (!option) {
                    console.error('option not found');
                    if (retry < 3) {
                        request(retry + 1);
                    }
                    return;
                };
                plan.current = [...(data.plan ?? [])];
                execute(option, data.reason);
            }
        })
    }

    useEffect(() => {
        refresh();
    }, [turn]);

    useEffect(() => {
        if (current) {
            setHistory(prev => [...prev, {
                title: `${current.name}'s turn`,
                code: '',
            }]);
        }
    }, [current])

    return <div className="h-screen flex flex-col">
        <div className="flex-shrink-0">
            <h1 className="text-xl font-bold mb-2" onClick={() => debug()}>Options</h1>
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
                            execute(item);
                        }}
                    >
                        <span className="select-none">{index + 1}. {item.title}</span>
                    </div>
                ))}
            </div>
        </div>
        <HistoryView history={history} />
    </div>
}