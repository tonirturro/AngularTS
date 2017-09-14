/**
 * Service hosting the bussiness rules
 */
export class AppService {

    /**
     * Internal Repository
     */
    private selectedDeviceId_:number;

    /**
     * Initializes a new instance of the AppService class
     */
    constructor() {
        this.selectedDeviceId_ = -1;
    }

    /**
     * Device Id getter
     */
    get selectedDeviceId():number {
        return this.selectedDeviceId_;
    }

    /**
     * Device Id setter
     */
    set selectedDeviceId(newSelectedId:number) {
        this.selectedDeviceId_ = newSelectedId;
    }
}