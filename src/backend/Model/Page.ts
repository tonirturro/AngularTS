/*
** Defines the Page entity
*/

export class Page {
    public id: number;
    public deviceId: number;
    public pageSize: number;
    public printQuality: number;
    public mediaType: number;
    public destination: number;

    // Constructor
    constructor(
        id: number,
        deviceId: number,
        pageSize: number,
        printQuality: number,
        mediaType: number,
        destination: number) {
        this.id = id;
        this.deviceId = deviceId;
        this.pageSize = pageSize;
        this.printQuality = printQuality;
        this.mediaType = mediaType;
        this.destination = destination;
    }
}
