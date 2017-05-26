import * as angular from "angular";
import { PeopleGridController } from "./people-grid.component.ctrl"

/**
 * Defines the grid to add and delete people
 */
export class PeopleGrid implements angular.IComponentOptions {
    public templateUrl: string
    public controller: any;

    constructor() {
        this.templateUrl = "App/Components/peopleGrid/people-grid.template.htm";
        this.controller = ["$log", "dataService", PeopleGridController];
    }
}
