import { DebugUtil, RouteUtil } from "set-piece";
import { RootModel, ExtensionModel as Extensions, PlayerModel, GameModel, MageCardModel } from "hearthstone-core";

export class AppClient {
    private static _view?: HTMLElement;
    
    private static _root?: RootModel;
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
        AppClient._root = new RootModel({});
        RouteUtil.boot(AppClient._root);
    }

    @DebugUtil.log()
    public static async debug() {
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({ child: { hero: new MageCardModel({}) } }),
                playerB: new PlayerModel({ child: { hero: new MageCardModel({}) } }),
            }
        })
        AppClient._root?.start(game);
    }
}
