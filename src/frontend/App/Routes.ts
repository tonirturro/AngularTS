import { Ng1StateDeclaration, StateProvider, Transition } from "@uirouter/angularjs";
import { ILogService } from "angular";
import { DataService } from "./Services/DataService";

export class Routes {
    constructor(private $stateProvider: StateProvider) {
        const deviceEditState: Ng1StateDeclaration = {
            component: "deviceEdit",
            name: "device",
            resolve: {
                selectedDeviceId: [ "$transition$", ($transition$: Transition) => $transition$.params().deviceId]
            },
            url: "/device/{deviceId}"
        };
        const pagesEditState: Ng1StateDeclaration = {
            component: "pageGrid",
            name: "pages",
            resolve: {
                onAddPage: [ "$transition$", "dataService", ($transition$: Transition, dataService: DataService) => {
                    return () => {
                        const id = $transition$.params().deviceId;
                        dataService.addNewPage(id);
                    };
                }],
                pages: [ "dataService", (dataService: DataService) => dataService.pages ],
                selectedDeviceId: [ "$transition$", ($transition$: Transition) => $transition$.params().deviceId]
            },
            url: "/pages/{deviceId}"
        };

        this.$stateProvider.state(deviceEditState);
        this.$stateProvider.state(pagesEditState);
    }
}
