import { IServiceProvider, IServiceProviderFactory } from "angular";
import { IState, IStateService } from "../ui-routes";
import { IModalService, IModalSettings } from "../UiLib/definitions";

export interface IModalStates {
    create(name: string, options: IModalSettings): IState;
}

export class ModalStateProvider implements IModalStates, IServiceProvider {
    public get $get() {
        return this;
    }

    public create(name: string, options: IModalSettings): IState {
        let modalInstance;
        const onEnter = ($uiLibModal: IModalService, $state: IStateService) => {
            modalInstance = $uiLibModal.open(options);
            modalInstance.result.finally(() => {
                modalInstance = null;
                if ($state.$current.name === name) {
                    $state.go("^");
                }
            });
        };
        onEnter.$inject = [ "$uiLibModal", "$state" ];
        const onExit = () => {
            if (modalInstance) {
                modalInstance.close();
                modalInstance = null;
            }
        };

        const urlSegments = name.split(".");
        const url = "";
        urlSegments.forEach((segment) => {
            url.concat("/", segment);
        });

        return {
            name,
            onEnter,
            onExit,
            url
        } as IState;
    }
}
