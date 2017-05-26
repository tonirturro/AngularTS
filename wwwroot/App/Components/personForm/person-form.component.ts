import * as angular from "angular";
import { PersonFormController } from "./person-form.component.ctrl";

/**
 * Defines the form to add a new person
 */
export class PersonForm implements angular.IComponentOptions {
    public templateUrl: string;
    public controller: any;

    constructor() {
        this.templateUrl = "App/Components/personForm/person-form.template.htm";
        this.controller = ["$log", "dataService", PersonFormController];
    }
}
