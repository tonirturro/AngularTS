/*
** Defines the Page entity
*/ 

export class Page {
    id: number;
    deviceId: number;
    pageSize: number;
    printQuality: number;
    mediaType: number;
    destination: number;

    // Constructor
    constructor(id: number, deviceId:number, pageSize: number, printQuality: number, mediaType:number, destination:number) {
        this.id = id;
        this.deviceId = deviceId;
        this.pageSize = pageSize;
        this.printQuality = printQuality;
        this.mediaType = mediaType;
        this.destination = destination;
    }
}