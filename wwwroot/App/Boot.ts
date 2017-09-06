/*
** Angular loader
*/

import * as angular from "angular";
import { DataService } from "./Services/DataService";
import { ToolBar } from "./Components/toolBar/toolbar.component";
import { PageGrid } from "./Components/pageGrid/page-grid.component";
import { MainPage } from "./Components/main-page.component";

export let app = angular
    .module('myApp', [])
    .service("dataService", DataService)
    .component("toolBar", new ToolBar())
    .component("pageGrid", new PageGrid())
    .component("mainPage", new MainPage());

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name]);
});