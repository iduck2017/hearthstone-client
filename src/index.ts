import { DebugService, LogLevel } from "set-piece";
import { LegacyExtensionModel } from "hearthstone-extension-legacy";
import { AppService } from "hearthstone-core";

export function main() {
    DebugService.level = LogLevel.WARN;
    AppService.boot({
        extensions: [ new LegacyExtensionModel({}) ],
    });
    window.app = AppService;
    window.root = AppService.root;
    AppService.debug()
}
main();