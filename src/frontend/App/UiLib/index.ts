import * as angular from "angular";
import "angular-animate";
import { UiLibModal } from "./modal/modal";
import { ModalStack } from "./modal/modalStack";
import { Resolve } from "./modal/resolve";
import { MultiMapFactory } from "./multiMap/multiMapFactory";
import { Position } from "./position/position";
import { StackedMapFactory } from "./stackedMap/stakedMapFactory";

angular.module("ui-lib", ["ngAnimate"] )
    .service("$uibPosition", Position)
    .service("$$multiMap", MultiMapFactory)
    .service("$$stackedMap", StackedMapFactory)
    .service("$uibResolve", Resolve)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal);
