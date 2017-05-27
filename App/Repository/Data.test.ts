import { expect } from "chai";
import { Data } from "./Data";

describe("Data test repository", () => {

    var objectToTest: Data;

    beforeEach(() => {
        objectToTest = new Data();
    });

    it("Can read pages", () => {
        var pages = objectToTest.getPages();

        expect(pages.length).to.be.greaterThan(0);
    });
});
