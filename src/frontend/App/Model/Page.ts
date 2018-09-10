/*
** Defines the Page entity
*/

export class Page {
    public id: number;
    public deviceId: number;
    public class: string;
    public pageSize: string;
    public printQuality: string;
    public mediaType: string;
    public destination: string;

    // Constructor
    constructor(
        id: number,
        deviceId: number,
        pageSize: string,
        printQuality: string,
        mediaType: string,
        destination: string) {
        this.id = id;
        this.deviceId = deviceId;
        this.class = "";
        this.pageSize = pageSize;
        this.printQuality = printQuality;
        this.mediaType = mediaType;
        this.destination = destination;
    }
}
