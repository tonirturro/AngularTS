import * as angular from "angular";
import "angular-animate";
import { UiLibModal } from "./modal/modal";
import { ModalStack } from "./modal/modalStack";
import { Resolve } from "./modal/resolve";

angular.module("ui-lib", ["ngAnimate"] )
    .service("$uibResolve", Resolve)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal);
