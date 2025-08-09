import { DebugUtil, LogLevel } from "set-piece";
// import { LegacyExtensionModel } from "hearthstone-extension-legacy";
import { AppClient } from ".";

export function main() {
    DebugUtil.level = LogLevel.INFO;
    AppClient.boot({
        extensions: [],
    });
    window.app = AppClient.root;
    AppClient.debug()
}
main();