/*
** Defines the Page entity
*/ 

export class Page {
    id: number;
    pageSize: string;
    printQuality: string;
    mediaType: string;
    destination: string;

    // Constructor
    constructor(id: number, pageSize: string, printQuality: string, mediaType:string, destination:string) {
        this.id = id;
        this.pageSize = pageSize;
        this.printQuality = printQuality;
        this.mediaType = mediaType;
        this.destination = destination;
    }
}