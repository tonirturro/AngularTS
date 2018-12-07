/*
* Styles loader
*/
import "bootstrap/dist/css/bootstrap.css";
import "../styles/app.css";

/*
** Angular loader
*/

import "@uirouter/angularjs";
import * as angular from "angular";
import "angular-ui-bootstrap";

import "./templates";
import "./UiLib";

import { CloseDialog } from "./Components/closeDialog/close-dialog.component";
import { DeviceEdit } from "./Components/deviceEdit/device-edit.component";
import { DevicePanel } from "./Components/devicePanel/device-panel.component";
import { MainPage } from "./Components/main-page.component";
import { PageGrid } from "./Components/pageGrid/page-grid.component";
import { ToolBar } from "./Components/toolBar/toolbar.component";
import { Routes } from "./Routes";
import { DataService } from "./Services/DataService";

export let app = angular
    .module("myApp", ["templates", "ui.router", "ui.bootstrap", "ui-lib"] )
    .service("dataService", DataService)
    .config(Routes)
    .component("closeDialog", CloseDialog)
    .component("toolbar", ToolBar)
    .component("devicePanel", DevicePanel)
    .component("deviceEdit", DeviceEdit)
    .component("pageGrid", PageGrid)
    .component("mainPage", MainPage);

angular.element(document).ready(() => {
    angular.bootstrap(document.body, [app.name]);
});
