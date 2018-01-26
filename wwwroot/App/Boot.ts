/*
* Styles loader
*/
import "bootstrap/dist/css/bootstrap.css";
import "../styles/app.css";

/*
** Angular loader
*/

import * as angular from "angular";
import "./templates";

import { DevicePanel } from "./Components/devicePanel/device-panel.component";
import { MainPage } from "./Components/main-page.component";
import { PageGrid } from "./Components/pageGrid/page-grid.component";
import { ToolBar } from "./Components/toolBar/toolbar.component";
import { AppService } from "./Services/AppService";
import { DataService } from "./Services/DataService";

export let app = angular
    .module("myApp", ["templates"])
    .service("dataService", DataService)
    .service("appService", AppService)
    .component("toolbar", new ToolBar())
    .component("devicePanel", new DevicePanel())
    .component("pageGrid", new PageGrid())
    .component("mainPage", new MainPage());

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name]);
});
