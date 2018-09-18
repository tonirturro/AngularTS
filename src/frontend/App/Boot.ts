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
import { Selection } from "./Components/selection/selection.component";
import { ToolBar } from "./Components/toolBar/toolbar.component";
import { AppService } from "./Services/AppService";
import { DataService } from "./Services/DataService";

export let app = angular
    .module("myApp", ["templates"])
    .service("dataService", DataService)
    .service("appService", AppService)
    .component("toolbar", ToolBar)
    .component("devicePanel", DevicePanel)
    .component("pageGrid", PageGrid)
    .component("selection", Selection)
    .component("mainPage", MainPage);

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name]);
});
