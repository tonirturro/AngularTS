import { expect } from "chai";
import { Data } from "./Data";
import { Person } from "../Model/Person";

describe("Data test repository", () => {
    const expectedMessage = "message";
    const expectedItems = ["Item1", "Item2", "Item3"];
    var objectToTest: Data;

    beforeEach(() => {
        objectToTest = new Data(expectedMessage, expectedItems);
    });

    it("Is initialized correctly", () => {

        expect(objectToTest.message).to.equal(expectedMessage);
        var index = 0;
        for (let entry of expectedItems) {
            expect(objectToTest.items[index]).to.equal(entry);
            index++;
        }

        expect(objectToTest.people.length).to.equal(0);
    });

    it("Allow to add a person", () => {
        const newPerson = new Person(1, "aaa", "bbb");

        var result = objectToTest.addPerson(newPerson);

        expect(result).to.be.true;
        expect(objectToTest.people.length).to.equal(1);
    });

    it("The person added is correct", () => {
        const expectedId = 1;
        const expectedGivenName = "Federico";
        const expectedFamillyName = "Nejo";
        const newPerson = new Person(expectedId, expectedGivenName, expectedFamillyName);

        objectToTest.addPerson(newPerson);
        var firstPersonInList = objectToTest.people[0];

        expect(firstPersonInList.id).to.equal(expectedId);
        expect(firstPersonInList.givenName).to.equal(expectedGivenName);
        expect(firstPersonInList.famillyName).to.equal(expectedFamillyName);
    });

    it("A person can't be added twice", () => {
        const newPerson = new Person(1, "aaa", "bbb");

        objectToTest.addPerson(newPerson);
        var result = objectToTest.addPerson(newPerson);

        expect(result).to.be.false;
    });

    it("Allow to delete a person", () => {
        objectToTest.addPerson(new Person(1, "aaa", "bbb"));
        var personToDelete = objectToTest.people[0];

        var result = objectToTest.deletePerson(personToDelete.id);

        expect(result).to.be.true;
        expect(objectToTest.people.length).to.equal(0);
    });

    it("Only the person deleted is deleted", () => {
        var person1 = new Person(1, "aaa", "bbb");
        var person2 = new Person(2, "ccc", "ddd");
        objectToTest.addPerson(person1);
        objectToTest.addPerson(person2);

        objectToTest.deletePerson(person1.id);

        expect(objectToTest.people[0].id).to.equal(person2.id);
    });
});
