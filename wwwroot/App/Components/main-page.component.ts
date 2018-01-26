import * as angular from "angular";

/**
 * Wraps the components into the Single Page Application
 */
export class MainPage implements angular.IComponentOptions {
    public templateUrl: string;

    constructor() {
        this.templateUrl = "main-page.template.htm";
    }
}
