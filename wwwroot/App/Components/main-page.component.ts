import * as angular from "angular";

/**
 * Wraps the components into the Single Page Application
 */
export class MainPage implements angular.IComponentOptions {
    public template: string
    public controller: any;

    constructor() {
        this.template = require('./main-page.template.htm');
        this.controller = () => {};
    }
}