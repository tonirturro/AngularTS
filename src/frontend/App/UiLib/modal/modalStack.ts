import { IModalInstanceService, IModalStackedMapKeyValuePair, IModalStackService } from "../definitions";

export class ModalStack implements IModalStackService {
    public open(modalInstance: IModalInstanceService, modal: any): void {
        throw new Error("Method not implemented.");
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
}
