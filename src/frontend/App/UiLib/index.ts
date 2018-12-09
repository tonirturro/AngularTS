import * as angular from "angular";
import "angular-animate";
import { UiLibModal } from "./modal/modal";
import { ModalStack } from "./modal/modalStack";
import { Resolve } from "./modal/resolve";
import { MultiMap } from "./multiMap/multimap";
import { StackedMapFactory } from "./stackedMap/stakedMapFactory";

angular.module("ui-lib", ["ngAnimate"] )
    .service("$$multiMap", MultiMap)
    .service("$$stackedMap", StackedMapFactory)
    .service("$uibResolve", Resolve)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal);
