import { IComponentOptions } from "angular";

/**
 * Wraps the components into the Single Page Application
 */
export class MainPage implements IComponentOptions {
    public templateUrl: string;

    constructor() {
        this.templateUrl = "main-page.template.htm";
    }
}
