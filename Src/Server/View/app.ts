/*
* The main module
*/

import * as angular from "angular";
import { MainController } from "./MainController";

var app;

angular.element(document).ready(() => {
    let app = angular.module('myApp', []).controller('MainController', MainController);
    angular.bootstrap(document.body, ['myApp']);
});

export default app;
