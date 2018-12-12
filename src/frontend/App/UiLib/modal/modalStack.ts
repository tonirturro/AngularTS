import { IAugmentedJQuery, ICompileService, IDocumentService, IRootScopeService } from "angular";
import * as angular from "angular";
import {
    IModalInstanceService,
    IModalStackedMapKeyValuePair,
    IModalStackService,
    IMultiMap,
    IMultiMapFactory,
    IPositionService,
    IStackedMapFactory,
    IStakedMap
} from "../definitions";

export class ModalStack implements IModalStackService {

    public static $inject = [
        "$animate",
        "$rootScope",
        "$compile",
        "$document",
        "$uibPosition",
        "$$multiMap",
        "$$stackedMap"];

    private readonly OPENED_MODAL_CLASS = "modal-open";
    private readonly SNAKE_CASE_REGEXP = /[A-Z]/g;
    private readonly ARIA_HIDDEN_ATTRIBUTE_NAME = "data-bootstrap-modal-aria-hidden-count";
    private openedWindows: IStakedMap;
    private previousTopOpenedModal = null;
    private openedClasses: IMultiMap;
    private topModalIndex = 0;
    private backdropDomEl: IAugmentedJQuery;
    private backdropScope: any;
    private scrollbarPadding: any;

    constructor(
        private $animate: angular.animate.IAnimateService,
        private $rootScope: IRootScopeService,
        private $compile: ICompileService,
        private $document: IDocumentService,
        private $uibPosition: IPositionService,
        private $$multiMap: IMultiMapFactory,
        private $$stackedMap: IStackedMapFactory) {
        this.openedWindows = this.$$stackedMap.createNew();
        this.openedClasses = this.$$multiMap.createNew();
    }

    public open(modalInstance: IModalInstanceService, modal: any) {
        const modalOpener = this.$document[0].activeElement;
        const modalBodyClass = modal.openedClass || this.OPENED_MODAL_CLASS;

        this.toggleTopWindowClass(false);

        // Store the current top first, to determine what index we ought to use
        // for the current top modal
        this.previousTopOpenedModal = this.openedWindows.top();

        this.openedWindows.add(modalInstance, {
            animation: modal.animation,
            appendTo: modal.appendTo,
            backdrop: modal.backdrop,
            closedDeferred: modal.closedDeferred,
            deferred: modal.deferred,
            keyboard: modal.keyboard,
            modalScope: modal.scope,
            openedClass: modal.openedClass,
            renderDeferred: modal.renderDeferred,
            windowTopClass: modal.windowTopClass
        });

        this.openedClasses.put(modalBodyClass, modalInstance);

        const appendToElement = modal.appendTo;
        const currBackdropIndex = this.backdropIndex();

        if (currBackdropIndex >= 0 && !this.backdropDomEl) {
            this.backdropScope = this.$rootScope.$new(true);
            this.backdropScope.modalOptions = modal;
            this.backdropScope.index = currBackdropIndex;
            this.backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
            this.backdropDomEl.attr({
                "class": "modal-backdrop",
                "modal-in-class": "in",
                "ng-style": "{'z-index': 1040 + (index && 1 || 0) + index*10}",
                "uib-modal-animation-class": "fade"
            });
            if (modal.backdropClass) {
                this.backdropDomEl.addClass(modal.backdropClass);
            }

            if (modal.animation) {
                this.backdropDomEl.attr("modal-animation", "true");
            }
            this.$compile(this.backdropDomEl)(this.backdropScope);
            this.$animate.enter(this.backdropDomEl, appendToElement);
            if (this.$uibPosition.isScrollable(appendToElement)) {
                this.scrollbarPadding = this.$uibPosition.scrollbarPadding(appendToElement);
                if (this.scrollbarPadding.heightOverflow && this.scrollbarPadding.scrollbarWidth) {
                    appendToElement.css({ paddingRight: this.scrollbarPadding.right + "px" });
                }
            }
        }

        let content;
        if (modal.component) {
            content = document.createElement(this.snake_case(modal.component.name));
            content = angular.element(content);
            content.attr({
                "close": "$close($value)",
                "dismiss": "$dismiss($value)",
                "modal-instance": "$uibModalInstance",
                "resolve": "$resolve",
            });
        } else {
            content = modal.content;
        }

        // Set the top modal index based on the index of the previous top modal
        this.topModalIndex = this.previousTopOpenedModal ?
            parseInt(this.previousTopOpenedModal.value.modalDomEl.attr("index"), 10) + 1 : 0;
        const angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
        angularDomEl.attr({
            "animate": "animate",
            "aria-describedby": modal.ariaDescribedBy,
            "aria-labelledby": modal.ariaLabelledBy,
            "class": "modal",
            "index": this.topModalIndex,
            "modal-in-class": "in",
            "ng-style": "{'z-index': 1050 + $$topModalIndex*10, display: 'block'}",
            "role": "dialog",
            "size": modal.size,
            "tabindex": -1,
            "template-url": modal.windowTemplateUrl,
            "uib-modal-animation-class": "fade",
            "window-top-class": modal.windowTopClass,
        }).append(content);
        if (modal.windowClass) {
            angularDomEl.addClass(modal.windowClass);
        }

        if (modal.animation) {
            angularDomEl.attr("modal-animation", "true");
        }

        appendToElement.addClass(modalBodyClass);
        if (modal.scope) {
            // we need to explicitly add the modal index to the modal scope
            // because it is needed by ngStyle to compute the zIndex property.
            modal.scope.$$topModalIndex = this.topModalIndex;
        }
        this.$animate.enter(this.$compile(angularDomEl)(modal.scope), appendToElement);

        this.openedWindows.top().value.modalDomEl = angularDomEl;
        this.openedWindows.top().value.modalOpener = modalOpener;

        this.applyAriaHidden(angularDomEl);
    }

    public close(modalInstance: IModalInstanceService, result?: any): void {
        throw new Error("Method not implemented.");
    }

    public dismiss(modalInstance: IModalInstanceService, reason?: any): void {
        throw new Error("Method not implemented.");
    }

    public dismissAll(reason?: any): void {
        throw new Error("Method not implemented.");
    }

    public getTop(): IModalStackedMapKeyValuePair {
        throw new Error("Method not implemented.");
    }

    // Add or remove "windowTopClass" from the top window in the stack
    private toggleTopWindowClass(toggleSwitch) {
        if (this.openedWindows.length() > 0) {
            const modalWindow = this.openedWindows.top().value;
            modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || "", toggleSwitch);
        }
    }

    private backdropIndex(): number {
        let topBackdropIndex = -1;
        this.openedWindows.keys().forEach((opened, i) => {
            if (this.openedWindows.get(opened).value.backdrop) {
                topBackdropIndex = i;
            }
        });

        // If any backdrop exist, ensure that it's index is always
        // right below the top modal
        if (topBackdropIndex > -1 && topBackdropIndex < this.topModalIndex) {
            topBackdropIndex = this.topModalIndex;
        }
        return topBackdropIndex;
    }

    private snake_case(name: string): string {
        const separator = "-";
        return name.replace(this.SNAKE_CASE_REGEXP, (letter, pos) => {
            return (pos ? separator : "") + letter.toLowerCase();
        });
    }

    private applyAriaHidden(el: IAugmentedJQuery) {
        if (!el || el[0].tagName === "BODY") {
          return;
        }

        this.getSiblings(el).forEach((sibling) => {
          const elemIsAlreadyHidden = sibling.getAttribute("aria-hidden") === "true";
          let ariaHiddenCount = parseInt(sibling.getAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME), 10);

          if (!ariaHiddenCount) {
            ariaHiddenCount = elemIsAlreadyHidden ? 1 : 0;
          }

          sibling.setAttribute(this.ARIA_HIDDEN_ATTRIBUTE_NAME, (ariaHiddenCount + 1).toString());
          sibling.setAttribute("aria-hidden", "true");
        });

        return this.applyAriaHidden(el.parent());
    }

    private getSiblings(el: IAugmentedJQuery): HTMLElement[] {
        const children = el.parent() ? el.parent().children() : [];

        return Array.prototype.filter.call(children, (child) => {
          return child !== el[0];
        });
    }
}