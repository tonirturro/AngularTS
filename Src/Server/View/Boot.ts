/*
* The main module
*/

import * as angular from "angular";
import { MainController } from "./MainController";
import { DataService } from "./Services/DataService";

export let app = angular
    .module('myApp', [])
    .service("dataService", DataService)
    .controller("MainController", MainController);

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [ app.name ]);
});

