import * as angular from "angular";
import { UI_LIB_NAME } from "../UiLib";
import { DataService } from "./DataService";
import { ModalManager } from "./ModalManager";

export const SERVICES_MODULE_NAME = angular.module("myApp.services", [ UI_LIB_NAME ])
    .service("dataService", DataService)
    .service("modalManager", ModalManager)
    .name;
