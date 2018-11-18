import * as angular from "angular";
import { PageFields } from "../../../../common/model";
import { PageGridController } from "./page-grid.component.ctrl";

describe("Page grid controller", () => {

    /**
     * Common test resources
     */
    let controller: PageGridController;
    let lastFieldUpdated: string;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(($componentController) => {
        controller = $componentController("pageGrid");
        controller.onUpdatePages = (data: any) => {
            lastFieldUpdated = data.field;
        };
        controller.capabilities = {};
        controller.capabilities[PageFields.PageSize] = [];
        controller.capabilities[PageFields.PrintQuality] = [];
        controller.capabilities[PageFields.MediaType] = [];
        controller.capabilities[PageFields.Destination] = [];
    }));

    /**
     *
     *  The test cases
     *
     */
    it("A page size change is reported", () => {
        lastFieldUpdated = "";
        controller.updatePageSize(0);

        expect(lastFieldUpdated).toBe(PageFields.PageSize);
    });

    it("A print quality change is reported", () => {
        lastFieldUpdated = "";
        controller.updatePrintQuality(0);

        expect(lastFieldUpdated).toBe(PageFields.PrintQuality);
    });

    it("A media type change is reported", () => {
        lastFieldUpdated = "";
        controller.updateMediaType(0);

        expect(lastFieldUpdated).toBe(PageFields.MediaType);
    });

    it("A destination change is reported", () => {
        lastFieldUpdated = "";
        controller.updateDestination(0);

        expect(lastFieldUpdated).toBe(PageFields.Destination);
    });

});
