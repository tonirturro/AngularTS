import {Person} from "../Model/Person";

//
// Class definition for the repository
//
export class Data {
    message: string;
    items: string[];
    people: Person[];

    //
    // Initializes a new instance of the Data class
    //
    constructor(message: string, items: string[]) {
        this.message = message;
        this.items = [];
        this.people = [];
        for (let entry of items) {
            this.items.push(entry);
        }
    }
}