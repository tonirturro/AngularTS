import * as angular from "angular";
import "angular-animate";
import { UiLibModal } from "./modal/modal";
import { ModalStack } from "./modal/modalStack";
import { Resolver } from "./modal/resolver";
import { MultiMapFactory } from "./multiMap/multiMapFactory";
import { Position } from "./position/position";
import { StackedMapFactory } from "./stackedMap/stakedMapFactory";

angular.module("ui-lib", ["ngAnimate"] )
    .provider("$uibResolve", Resolver)
    .service("$uibPosition", Position)
    .service("$$multiMap", MultiMapFactory)
    .service("$$stackedMap", StackedMapFactory)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal);
