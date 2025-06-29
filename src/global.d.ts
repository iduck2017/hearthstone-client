import { AppService, RootModel } from "hearthstone-core";

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare global {
    interface Window {
        app: AppService | undefined;
        root: RootModel | undefined;
    }
}