import { DebugUtil, RouteUtil } from "set-piece";
import { AppModel, PlayerModel, GameModel, MageModel } from "hearthstone-core";
import React from "react";
import { createRoot } from "react-dom/client";
import AppView from "./views/app";

export class AppClient {
    private static _view?: HTMLElement;
    
    private static _root?: AppModel;
    public static get root() {
        return AppClient._root;
    }
    private constructor() {}

    public static boot() {
        AppClient._root = new AppModel();
        
        const container = document.getElementById('root');
        if (container) {
            const reactRoot = createRoot(container);
            reactRoot.render(<AppView app={AppClient._root} />);
        }
    }

    public static async debug() {
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({
                    child: { hero: new MageModel() }
                }),
                playerB: new PlayerModel({
                    child: { hero: new MageModel() }
                }),
            }
        })
        AppClient._root?.set(game);
    }
}
