import * as angular from "angular";

/**
 * Wraps the components into the Single Page Application
 */
export class MainPage implements angular.IComponentOptions {
    public templateUrl: string
    public controller: any;

    constructor() {
        this.templateUrl = "App/Components/main-page.template.htm";
        this.controller = () => {};
    }
}