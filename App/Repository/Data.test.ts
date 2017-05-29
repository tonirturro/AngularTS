import { expect } from "chai";
import { Data } from "./Data";

describe("Data test repository", () => {

    var objectToTest: Data;

    beforeEach(() => {
        objectToTest = new Data();
    });

    it("Is empty when initialized", () => {
        var pages = objectToTest.getPages();

        expect(pages).to.be.empty;
    });

    it("Can add pages", () => {
        objectToTest.newPage();

        var pages = objectToTest.getPages();
        expect(pages).not.to.be.empty;
    });

    it("Can delete pages", () => {
        // Add two pages and verify them
        objectToTest.newPage();
        objectToTest.newPage();
        var pages = objectToTest.getPages();
        expect(pages.length).to.be.equal(2);

        // Delete on page
        var idToDelete = pages[0].id;
        expect(objectToTest.deletePage(idToDelete)).to.be.true;

        // Verify page deletion
        pages = objectToTest.getPages();
        expect(pages.length).to.be.equal(1);
        expect(pages[0].id).not.to.be.equal(idToDelete);
    });
});
