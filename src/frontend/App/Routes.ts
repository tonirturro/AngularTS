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
                selectedDeviceId: [ "$transition$", ($transition$: Transition) => $transition$.params().deviceId]
            },
            url: "/pages/{deviceId}"
        };

        this.$stateProvider.state(deviceEditState);
        this.$stateProvider.state(pagesEditState);
    }
}
