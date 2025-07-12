import { RootModel } from "hearthstone-core";
import { AppClient } from ".";

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare global {
    interface Window {
        app: AppClient | undefined;
        root: RootModel | undefined;
    }
}