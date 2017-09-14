import * as angular from "angular";
import { PageGridController } from "./page-grid.component.ctrl"

/**
 * Defines the grid to add and delete people
 */
export class PageGrid implements angular.IComponentOptions {
    public templateUrl: string
    public controller: any;

    /**
     * Initializes a new instance of the PageGrid class.
     */
    constructor() {
        this.templateUrl = "App/Components/pageGrid/page-grid.template.htm";
        this.controller = ["$log", "appService", "dataService", PageGridController];
    }
}
