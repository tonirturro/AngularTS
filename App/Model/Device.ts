/*
** Defines the Device entity
*/

export class Device {
    public id: number;
    public name: string;

    // Constructor
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
