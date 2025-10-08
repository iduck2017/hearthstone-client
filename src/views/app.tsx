import { AppModel, CardModel, ConfigModel, GameModel, LibraryUtil, MageModel, MinionCardModel, PlayerModel, SpellCardModel, WeaponCardModel } from "hearthstone-core";
import React, { useEffect } from "react";
import GameView from "./game";
import { useModel } from "../hooks/use-model";
import { ConfigView } from "./config";
import { CommandView } from "./command";

export default function AppView(props: {
    root: AppModel
}) {
    const root = useModel(props.root);

    const generate = () => {
        const cards: CardModel[] = [];
        const library = LibraryUtil.registry.filter(item => item.state.isCollectible);
        const size = library.length;
        for (let count = 0; count < 30; count ++) {
            const index = Math.floor(Math.random() * size);
            const card = library[index];
            if (!card) continue;
            cards.push(card);
        }
        const config = new ConfigModel(() => ({
            child: { cards }
        }));
        return config;
    }

    const set = () => {
        const config = generate();
        props.root.set(config);
    }

    const start = () => {
        const configA = generate();
        const configB = generate();
        const game = new GameModel(() => ({
            child: {
                playerA: new PlayerModel(() => ({
                    child: { 
                        hero: new MageModel(),
                        deck: configA.use(),
                    }
                })),
                playerB: new PlayerModel(() => ({
                    child: { 
                        hero: new MageModel(),
                        deck: configB.use(),
                    }
                })),
            }
        }))
        props.root.set(game);
        game.child.turn.next();
    }

    useEffect(() => {
        start();
    }, []);

    if (!root) return null;
    return <div className="flex h-screen overflow-hidden">
        <div className="p-4 w-[300px] min-w-[300px] max-w-[300px] bg-gray-100 border-r border-gray-300 flex-shrink-0">
            <CommandView game={root.child.game} />
        </div>
        <div className="overflow-auto">
            <div className="flex gap-4 items-center p-4">
                <h1 className="text-2xl font-bold">Hearthstone</h1>
                <span className="text-sm">{root.state.version}</span>
                {/* <button onClick={generate} className="text-blue-500 underline">generate</button>
                <button onClick={generate} className="text-blue-500 underline">start</button> */}
            </div>
            {root.child.game ? 
                <GameView game={root.child.game} /> : 
                <div className="flex gap-4 items-center">
                    {root.child.configs.map((item, index) => <ConfigView key={item.uuid} config={item} index={index} />)}
                </div>
            }
        </div>
    </div>
}