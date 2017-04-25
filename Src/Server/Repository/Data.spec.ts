import { Data } from "./Data";
import { Person } from "../Model/Person";

describe("Data test repository",
    () => {

        const expectedMessage = "message";
        const expectedItems = ["Item1", "Item2", "Item3"];
        var objectToTest: Data;       

        beforeEach(() => {
            objectToTest = new Data(expectedMessage, expectedItems);
        });

        it("Is initialized correctly", () => {

            expect(objectToTest.message).toBe(expectedMessage);
            var index = 0;

            for (let entry of expectedItems) {
                expect(objectToTest.items[index]).toBe(entry);
                index++;
            }

            expect(objectToTest.people.length).toBe(0);
        });

        it("Allow to add a person", () => {
            const newPerson = new Person(1, "aaa", "bbb");

            var result = objectToTest.addPerson(newPerson);

            expect(result).toBeTruthy;
            expect(objectToTest.people.length).toBe(1);
        });

        it("The person added is correct", () => {
            const expectedId = 1;
            const expectedGivenName = "Federico";
            const expectedFamillyName = "Nejo";
            const newPerson = new Person(expectedId, expectedGivenName, expectedFamillyName);

            objectToTest.addPerson(newPerson);

            var firstPersonInList = objectToTest.people[0];

            expect(firstPersonInList.id).toBe(expectedId);
            expect(firstPersonInList.givenName).toBe(expectedGivenName);
            expect(firstPersonInList.famillyName).toBe(expectedFamillyName);
        });

        it("Allow to delete a person", () => {
            objectToTest.addPerson(new Person(1, "aaa", "bbb"));
            var personToDelete = objectToTest.people[0];

            var result = objectToTest.deletePerson(personToDelete.id);

            expect(result).toBeTruthy;
            expect(objectToTest.people.length).toBe(0);
        });

    });

