import * as angular from "angular";

import "../UiLib/styles";

import "../templates";

import { SERVICES_MODULE_NAME } from "../Services";
import { UI_LIB_NAME } from "../UiLib";
import { IModalSettings } from "../UiLib/definitions";
import { ConfirmationDialog } from "./confimationDialog/confirmation-dialog.component";
import { DeviceEdit } from "./deviceEdit/device-edit.component";
import { DevicePanel } from "./devicePanel/device-panel.component";
import { MainPage } from "./main-page.component";
import { ModalManager } from "./modal-manager.service";
import { PageGrid } from "./pageGrid/page-grid.component";
import { ToolBar } from "./toolBar/toolbar.component";

export enum EModals {
    Confimation = "confirmation"
}

interface IModalDefinition {
    name: EModals;
    settings: IModalSettings;
}

const modals: IModalDefinition[] = [
    { name: EModals.Confimation, settings: { component: "confirmationDialog", size: "md" }}
];

const getModal = (name: EModals) => modals.find((modal) => modal.name === name).settings.component;

export const COMPONENTS_MODULE_NAME = angular.module(
        "myApp.components",
        [ "templates", "ui.router", UI_LIB_NAME, SERVICES_MODULE_NAME ])
    .service("modalManager", ModalManager)
    .component(getModal(EModals.Confimation), ConfirmationDialog)
    .component("toolbar", ToolBar)
    .component("devicePanel", DevicePanel)
    .component("deviceEdit", DeviceEdit)
    .component("pageGrid", PageGrid)
    .component("mainPage", MainPage)
    .run(["modalManager", (modalManager: ModalManager) => {
        modals.forEach((modal: IModalDefinition) => {
            modalManager.register(modal.name, modal.settings);
        });
    }])
    .name;
