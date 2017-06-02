import { expect } from "chai";
import { Data } from "./Data";

describe("Data test repository", () => {

    var objectToTest: Data;

    /**
    * Aux method to add pages
    */
    var addPages = ():number => {
        objectToTest.newPage();
        objectToTest.newPage();
        objectToTest.newPage();
        return 3;
    }

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
        // Add pages and verify them
        var addedPages = addPages();
        var pages = objectToTest.getPages();
        expect(pages.length).to.be.equal(addedPages);

        // Delete on page
        var idToDelete = pages[0].id;
        expect(objectToTest.deletePage(idToDelete)).to.be.true;

        // Verify page deletion
        pages = objectToTest.getPages();
        expect(pages.length).to.be.equal(addedPages - 1);
        expect(pages[0].id).not.to.be.equal(idToDelete);
    });

    it("Can update page size for an existing page", () => {
        var addedPages = addPages();
        var currentPage = objectToTest.getPages()[1];
        var newValue = currentPage.pageSize + 1;

        var result = objectToTest.updatePageSize(currentPage.id, newValue);
        var updatedPage = objectToTest.getPages()[1];

        expect(result).to.be.true;
        expect(updatedPage.pageSize).to.equal(newValue);
    });

    it("Can't update page size if the page does not exist", () => {
        addPages();
        var invalidId = 0;
        objectToTest.getPages().forEach(page => {
            if (page.id > invalidId) {
                invalidId = page.id;
            }
        });

        invalidId++;

        var result = objectToTest.updatePageSize(invalidId, 0);

        expect(result).to.be.false;
    });
});
