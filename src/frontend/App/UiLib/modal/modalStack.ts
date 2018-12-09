import { IDocumentService } from "angular";
import {
    IModalInstanceService,
    IModalStackedMapKeyValuePair,
    IModalStackService,
    IStackedMapFactory,
    IStakedMap} from "../definitions";

export class ModalStack implements IModalStackService {

    public static $inject = ["$document", "$$stackedMap"];

    private readonly OPENED_MODAL_CLASS = "modal-open";
    private openedWindows: IStakedMap;
    private previousTopOpenedModal = null;

    constructor(private $document: IDocumentService, private $$stackedMap: IStackedMapFactory) {
        this.openedWindows = this.$$stackedMap.createNew();
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
}
