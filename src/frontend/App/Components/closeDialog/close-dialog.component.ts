import { IComponentOptions } from "angular";
import { CloseDialogController } from "./close-dialog.component.ctrl";

export const CloseDialog: IComponentOptions = {
    bindings: {
        close: "&",
        dismiss: "&"
    },
    controller: CloseDialogController,
    controllerAs: "closeDialogController",
    templateUrl: "closeDialog/close-dialog.template.htm"
};
