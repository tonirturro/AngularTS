/*
** Defines the Device entity
*/ 

export class Device {
    id: number;
    name: string;

    // Constructor
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}