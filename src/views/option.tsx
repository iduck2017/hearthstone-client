import { Option, GameModel, AnimeUtil, PlayerType } from "hearthstone-core";
import React, { useEffect, useState } from "react";
import { useModel } from "../hooks/use-model";
import { Popover } from "./popover";
import { History, HistoryView } from "./history";
import { Model } from "set-piece";

export type Verbose = {
    reason: string;
    plan: string;
    situation: string;
    highlight: string;
}

export function OptionView(props: {
    game?: GameModel
}) {
    const [options, setOptions] = useState<Option[]>([]);
    const [history, setHistory] = useState<History[]>([]);
    const game = props.game;
    const turn = game?.child.turn;
    const current = turn?.refer.current;
    const isUser = current?.state.role === PlayerType.USER;

    const snapshot = (model?: Model) => {
        if (!model) return;
        const result: any = {
            uuid: model.uuid,
            state: model.state,
            child: {},
            refer: {},
        }
        Object.keys(model.child).forEach(key => {
            const value = Reflect.get(model.child, key);
            if (!value) return;
            if (value instanceof Array) result.child[key] = value.map(item => snapshot(item));
            if (value instanceof Model) result.child[key] = snapshot(value);
        })
        Object.keys(model.refer).forEach(key => {
            const value = Reflect.get(model.refer, key);
            if (!value) return;
            if (value instanceof Array) result.refer[key] = value.map(item => item.uuid);
            if (value instanceof Model) result.refer[key] = value.uuid;
        })
        return result;
    }

    const debug = () => {
        console.log(
            JSON.stringify(snapshot(game)), 
            JSON.stringify(options.map(item => ({
                code: item.code,
                title: item.title,
                desc: item.desc,
            }))),
            JSON.stringify(history),
        )
    }

    const execute = (option: Option, verbose?: Verbose) => {
        setHistory(prev => [...prev, {
            title: option.title,
            desc: option.desc,
            code: option.code,
            reason: verbose?.reason,
            plan: verbose?.plan,
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
        if (!isUser) {
            console.log('waiting for ai decision...');
            const body: {
                player: string,
                snapshot: string,
                history: string,
                options: string,
            } = {
                player: current?.name,
                snapshot: JSON.stringify(snapshot(game)),
                history: JSON.stringify(history),
                options: JSON.stringify(options),
            };
            fetch('http://localhost:8080/select-option', {
                method: 'POST',
                body: JSON.stringify(body),
            })
            .then(res => res.json())
            .then((data: {
                option: Option,
                verbose: Verbose
            }) => {
                const code = data.option.code;
                const option = options.find(item => item.code === code);
                if (!option) {
                    console.error('option not found');
                    return;
                };
                execute(option, data.verbose);
            })
        }
    }, [options])

    useEffect(() => {
        refresh();
    }, [turn]);

    useEffect(() => {
        if (current) {
            setHistory(prev => [...prev, {
                title: `${current.name}'s turn`,
                desc: '',
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