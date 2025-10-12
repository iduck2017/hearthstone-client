import { AppClient } from ".";
import "hearthstone-extension-legacy";
import "./index.css";

export function main() {
    AppClient.boot();
    window.app = AppClient.root;
    // AppClient.debug()
}
main();