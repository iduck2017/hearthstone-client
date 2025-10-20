import { AppModel, BoardModel, CardModel, CollectionModel, GameModel, HandModel, LibraryUtil, MageModel, PlayerModel, PlayerType } from "hearthstone-core";
import React, { useEffect } from "react";
import GameView from "./game";
import { useModel } from "../hooks/use-model";
import { CollectionView } from "./collection";
import { OptionView } from "./option";
import { IceLanceModel, WispModel, ShieldbearerModel, EmperorCobraModel, ArcaneMissilesModel, SilenceModel, StonetuskBoarModel, EmeraldSkytalonModel } from "hearthstone-extension-legacy";
import { AIView } from "./ai";
import { HistoryView } from "./history";
import { PlanView } from "./plan";

export default function AppView(props: {
    app: AppModel
}) {
    const app = useModel(props.app);

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
        const config = new CollectionModel({ child: { cards }});
        return config;
    }

    const set = () => {
        const config = generate();
        props.app.set(config);
    }

    const init = () => {
        const configA = generate();
        const configB = generate();
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    state: {
                        role: PlayerType.USER,
                    },
                    child: { 
                        hero: new MageModel(),
                        hand: new HandModel({
                            child: {
                                // minions: [new EmeraldSkytalonModel()],
                                // spells: [new ArcaneMissilesModel(), ]
                            }
                        }),
                        board: new BoardModel({
                            child: {
                                minions: [],
                            }
                        }),
                        deck: configA.apply(),
                        collection: configA,
                    }
                }),
                playerB: new PlayerModel({
                    state: {
                        role: PlayerType.USER,
                    },
                    child: { 
                        hero: new MageModel(),
                        hand: new HandModel({
                            child: {
                                spells: [],
                            }
                        }),
                        board: new BoardModel({
                            child: {
                                minions: [],
                            }
                        }),
                        deck: configB.apply(),
                        collection: configB,
                    }
                }),
            }
        })
        props.app.set(game);
        game.start();
    }

    useEffect(() => {
        init();
    }, []);

    if (!app) return null;
    return <div className="flex h-screen overflow-hidden">
        <div className="p-4 w-[300px] min-w-[300px] max-w-[300px] bg-gray-100 border-r border-gray-300 flex-shrink-0 overflow-y-auto">
            <OptionView app={props.app} />
            <PlanView app={props.app} />
            <HistoryView />
        </div>
        <div className="overflow-auto">
            <div className="flex gap-4 items-center p-4">
                <h1 className="text-2xl font-bold">Hearthstone</h1>
                <span className="text-sm">{app.state.version}</span>
            </div>
            <AIView />
            {app.child.game ? 
                <GameView game={app.child.game} /> : 
                <div className="flex gap-4 items-center">
                    {app.child.configs.map((item, index) => <CollectionView key={item.uuid} collection={item} index={index} />)}
                </div>
            }
        </div>
    </div>
}