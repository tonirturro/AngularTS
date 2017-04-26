import {Person} from "../Model/Person";

//
// Class definition for the repository
//
export class Data {
    private _message: string;
    private _items: string[];
    private _people: Person[];

    //
    // Initializes a new instance of the Data class
    //
    constructor(message: string, items: string[]) {
        this._message = message;
        this._items = [];
        this._people = [];
        for (let entry of items) {
            this._items.push(entry);
        }
    }

    //
    // Gets people
    //
    get people(): Person[] {
        return this._people;
    }

    //
    // Gets items
    //
    get items(): string[] {
        return this._items;
    }

    //
    // Gets message
    //
    get message(): string {
        return this._message;
    }

    //
    // Adds a person
    //
    addPerson(newPerson: Person): boolean {

        // Check if already exists
        for (let i of this._people) {
            if (i.id === newPerson.id) {
                return false;
            }
        }

        // Add otherwise
        this._people.push(newPerson);
        return true;
    }

    //
    // Deletes a person
    //
    deletePerson(idToDelete: number): boolean {
        // Check if already exists
        var index = 0;
        for (let i of this._people) {
            if (i.id === idToDelete) {
                this._people.splice(index, 1);
                return true;
            }

            index++;
        }

        // Not found
        return false;
    }
}