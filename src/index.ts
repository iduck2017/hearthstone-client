import { DebugUtil, RouteUtil } from "set-piece";
import { AppModel, PlayerModel, GameModel, MageModel } from "hearthstone-core";

export class AppClient {
    private static _view?: HTMLElement;
    
    private static _root?: AppModel;
    public static get root() {
        return AppClient._root;
    }
    private constructor() {}

    @DebugUtil.log()
    public static boot() {
        AppClient._root = new AppModel();
    }

    @DebugUtil.log()
    public static async debug() {
        const game = new GameModel(() => ({
            child: {
                playerA: new PlayerModel(() => ({
                    child: { character: new MageModel() }
                })),
                playerB: new PlayerModel(() => ({
                    child: { character: new MageModel() }
                })),
            }
        }))
        AppClient._root?.set(game);
    }
}
