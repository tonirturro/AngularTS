export class MainPageController {
    public selectedDeviceId: number;

    public selectDevice(deviceId: number) {
        this.selectedDeviceId = deviceId;
    }
}
