import { Entities } from "../Model/Entities";
import { Person } from "../Model/Person";
import { Page } from "../Model/Page";

//
// Class definition for the repository
//
export class Data {

    private _entities: Entities;

    //
    // Initializes a new instance of the Data class
    //
    /**
     * 
     * @param message
     * @param items
     */
    constructor(message: string, items: string[]) {
        this._entities = new Entities();
        this._entities.message = message;
        this._entities.items = [];
        this._entities.people = [];
        for (let entry of items) {
            this._entities.items.push(entry);
        }

        this._entities.pages = [];
        this._entities.pages.push(new Page(1, 1, 1, 1, 1));
        this._entities.pages.push(new Page(2, 1, 1, 1, 1));
    }

    //
    // Gets all entities
    //
    get entities(): Entities {
        return this._entities;
    }

    //
    // Gets people
    //
    get people(): Person[] {
        return this._entities.people;
    }

    //
    // Gets items
    //
    get items(): string[] {
        return this._entities.items;
    }

    //
    // Gets message
    //
    get message(): string {
        return this._entities.message;
    }

    //
    // Adds a person
    //
    addPerson(newPerson: Person): boolean {

        // Check if already exists
        for (let i of this._entities.people) {
            if (i.id === newPerson.id) {
                return false;
            }
        }

        // Add otherwise
        this._entities.people.push(newPerson);
        return true;
    }

    //
    // Deletes a person
    //
    deletePerson(idToDelete: number): boolean {
        // Check if already exists
        var index = 0;
        for (let i of this._entities.people) {
            if (i.id === idToDelete) {
                this._entities.people.splice(index, 1);
                return true;
            }

            index++;
        }

        // Not found
        return false;
    }

    /**
     * Gets the available pages
     */
    getPages(): Page[]
    {
        return this._entities.pages;
    }
}