import * as angular from "angular";
import { IModalInstanceService, IModalService, IModalSettings } from "../UiLib/definitions";

interface IDialogDictionary {
    [key: string]: IModalSettings;
}

export class ModalManager {

    public static $inject = ["$uiLibModal"];

    private readonly modalDefinitions: IDialogDictionary = {};
    private readonly modalStack: IModalInstanceService[] = [];
    private readonly baseDialogSettings: IModalSettings = {
        backdrop: "static",
        keyboard: false,
        size: "sm"
    };

    constructor(private $uiLibModal: IModalService) {}

    /**
     * Registers the modal settings to be used when opening it
     * @param name The dialog name to be registered
     * @param settings the settings associated to this dialog
     */
    public register(name: string, settings: IModalSettings): boolean {
        if (!this.modalDefinitions.hasOwnProperty(name)) {
            const modalSettings: IModalSettings = {};
            angular.extend(modalSettings, settings, this.baseDialogSettings);
            this.modalDefinitions[name] = modalSettings;
            return true;
        }

        return false;
    }

    /**
     * Open a new dialog on the top of the current one
     * @param name the name of the dialog to be opened
     */
    public push(name: string): IModalInstanceService {
        if (this.modalDefinitions.hasOwnProperty(name)) {
            const modalInstance = this.$uiLibModal.open(this.modalDefinitions[name]);
            this.modalStack.push(modalInstance);
            return modalInstance;
        }

        return null;
    }

    /**
     * Closes the last opened dialog and removes it from the stack
     */
    public pop(): boolean {
        if (this.modalStack.length > 0) {
            const instance = this.modalStack.pop();
            instance.close();
            return true;
        }

        return false;
    }

    /**
     * Replaces the last opened dialog
     * @param name the name of the dialog to be opened
     */
    public replaceTop(name: string): any {
        this.pop();
        return this.push(name);
    }

}
