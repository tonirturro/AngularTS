/*
* The main module
*/

import * as angular from "angular";
import { MainController } from "./MainController";

export let app = angular
    .module('myApp', [])
    .controller("MainController", MainController);

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [ app.name ]);
});

