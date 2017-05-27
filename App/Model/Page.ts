/*
** Defines the Page entity
*/ 

export class Page {
    id: number;
    pageSize: number;
    printQuality: number;
    mediaType: number;
    destination: number;

    // Constructor
    constructor(id: number, pageSize: number, printQuality: number, mediaType:number, destination:number) {
        this.id = id;
        this.pageSize = pageSize;
        this.printQuality = printQuality;
        this.mediaType = mediaType;
        this.destination = destination;
    }
}