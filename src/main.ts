import { DebugUtil, LogLevel } from "set-piece";
import { AppClient } from ".";
import "hearthstone-extension-legacy";

export function main() {
    DebugUtil.level = LogLevel.INFO;
    AppClient.boot();
    window.app = AppClient.root;
    AppClient.debug()
}
main();