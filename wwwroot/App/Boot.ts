/*
** Angular loader
*/

import * as angular from "angular";
import { DataService } from "./Services/DataService";
import { AppService } from "./Services/AppService";
import { ToolBar } from "./Components/toolBar/toolbar.component";
import { DevicePanel } from "./Components/devicePanel/device-panel.component";
import { PageGrid } from "./Components/pageGrid/page-grid.component";
import { MainPage } from "./Components/main-page.component";

export let app = angular
    .module('myApp', [])
    .service("dataService", DataService)
    .service("appService", AppService)
    .component("toolbar", new ToolBar())
    .component("devicePanel", new DevicePanel())
    .component("pageGrid", new PageGrid())
    .component("mainPage", new MainPage());

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name]);
});