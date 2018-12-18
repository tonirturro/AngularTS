import * as angular from "angular";
import { ITemplateCacheService } from "angular";
import "angular-animate";
import { UibModalAnimationClass } from "./modal/animation";
import { UibModalBackdrop } from "./modal/backdrop";
import { UiLibModal } from "./modal/modal";
import { ModalStack } from "./modal/modalStack";
import { Resolver } from "./modal/resolver";
import { UibModalTransclude } from "./modal/transclude";
import { UibModalWindow } from "./modal/window";
import { MultiMapFactory } from "./multiMap/multiMapFactory";
import { Position } from "./position/position";
import { StackedMapFactory } from "./stackedMap/stakedMapFactory";

angular.module("ui-lib", ["ngAnimate"] )
    .directive("uibModalBackdrop", UibModalBackdrop)
    .directive("uibModalWindow", UibModalWindow)
    .directive("uibModalAnimationClass", UibModalAnimationClass)
    .directive("uibModalTransclude", UibModalTransclude)
    .provider("$uibResolve", Resolver)
    .service("$uibPosition", Position)
    .service("$$multiMap", MultiMapFactory)
    .service("$$stackedMap", StackedMapFactory)
    .service("$uibModalStack", ModalStack)
    .service("$uiLibModal", UiLibModal)
    .run(["$templateCache", ($templateCache: ITemplateCacheService) => {
        $templateCache.put("uib/template/modal/window.html", require("./modal/window.htm"));
    }]);
