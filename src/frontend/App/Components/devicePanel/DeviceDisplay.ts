/**
 * Data to be displayed for a device
 */
export class DeviceDisplay {
    public id: number;
    public name: string;
    public class: string;

    // Constructor
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
        this.class = "";
    }
}
