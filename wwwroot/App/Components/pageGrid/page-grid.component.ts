import * as angular from "angular";
import { PageGridController } from "./page-grid.component.ctrl"

/**
 * Defines the grid to add and delete people
 */
export class PageGrid implements angular.IComponentOptions {
    public template: string
    public controller: any;

    /**
     * Initializes a new instance of the PageGrid class.
     */
    constructor() {
        this.template = require('./page-grid.template.htm');
        this.controller = PageGridController;
    }
}
