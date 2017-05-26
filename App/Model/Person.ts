/*
** Defines the Person entity
*/ 

export class Person {
    id: number;
    givenName: string;
    famillyName: string;

    // Constructor
    constructor(id: number, givenName: string, famillyName: string) {
        this.id = id;
        this.givenName = givenName;
        this.famillyName = famillyName;
    }
}