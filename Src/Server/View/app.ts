/*
* The main module
*/

import { angular } from "angular";
import { MainController } from "./MainController";

let app = angular.module('myApp', []).controller('MainController', MainController);

angular.element(document).ready(() => {
    angular.bootstrap(document.body, app.name);
});

export default app;
