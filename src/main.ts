import { DebugUtil, LogLevel } from "set-piece";
import { LegacyExtensionModel } from "hearthstone-extension-legacy";
import { AppClient } from ".";

export function main() {
    DebugUtil.level = LogLevel.WARN;
    AppClient.boot({
        extensions: [ new LegacyExtensionModel({}) ],
    });
    window.app = AppClient;
    window.root = AppClient.root;
    AppClient.debug()
}
main();