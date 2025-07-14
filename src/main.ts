import { DebugUtil, LogLevel } from "set-piece";
// import { LegacyExtensionModel } from "hearthstone-extension-legacy";
import { AppClient } from ".";

export function main() {
    DebugUtil.level = LogLevel.WARN;
    AppClient.boot({
        extensions: [],
    });
    window.app = AppClient;
    window.root = AppClient.root;
    AppClient.debug()
}
main();