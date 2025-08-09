import { DebugUtil, RouteUtil } from "set-piece";
import { AppModel, ExtensionModel as Extensions, PlayerModel, GameModel, MageModel } from "hearthstone-core";

export class AppClient {
    private static _view?: HTMLElement;
    
    private static _root?: AppModel;
    public static get root() {
        return AppClient._root;
    }

    private static _extensions?: Extensions[];
    public static get extensions() {
        return AppClient._extensions;
    }

    private constructor() {}

    @DebugUtil.log()
    public static boot(props: {
        extensions: Extensions[];
    }) {
        AppClient._extensions = props.extensions;
        AppClient._root = new AppModel({});
        RouteUtil.boot(AppClient._root);
    }

    @DebugUtil.log()
    public static async debug() {
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({ child: { hero: new MageModel({}) } }),
                playerB: new PlayerModel({ child: { hero: new MageModel({}) } }),
            }
        })
        AppClient._root?.set(game);
    }
}
