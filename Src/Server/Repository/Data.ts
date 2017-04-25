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

    //
    // Adds a person
    //
    addPerson(newPerson: Person): boolean {

        // Check if already exists
        for (let i of this.people) {
            if (i.id === newPerson.id) {
                return false;
            }
        }

        // Add otherwise
        this.people.push(newPerson);
        return true;
    }

    //
    // Deletes a person
    //
    deletePerson(idToDelete: number): boolean {
        // Check if already exists
        var index = 0;
        for (let i of this.people) {
            if (i.id === idToDelete) {
                this.people.splice(index, 1);
                return true;
            }

            index++;
        }

        // Not found
        return false;
    }
}