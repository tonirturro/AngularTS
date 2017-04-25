import { Data } from "./Data";

const expectedMessage = "message";
const expectedItems = ["Item1", "Item2", "Item3"];
var objectToTest: Data;       

describe("Data test repository",
    () => {


        beforeEach(() => {
        });


        it("Is initialized correctly", () => {

            objectToTest = new Data(expectedMessage, expectedItems);

            expect(objectToTest.message).toBe(expectedMessage);
            var index = 0;

            for (let entry of expectedItems) {
                expect(objectToTest.items[index]).toBe(entry);
                index++;
            }

            expect(objectToTest.people.length).toBe(0);
        });
    });

