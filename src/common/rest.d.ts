export interface IUpdateResponse {
    success: boolean;
}

export interface IPage {
    id: any
    deviceId: number,
    pageSize: number,
    printQuality: number,
    mediaType: number,
    destination: number
}

export interface IDeletePageResponse {
    deletedPageId: number;
    success: boolean;
}

export interface IDevice {
    id: number;
    name: string;
}

export interface IDeleteDeviceResponse {
    deletedDeviceId: number;
    success: boolean;
}