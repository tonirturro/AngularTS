//
// Defines the Person entity
// 

class Person {
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