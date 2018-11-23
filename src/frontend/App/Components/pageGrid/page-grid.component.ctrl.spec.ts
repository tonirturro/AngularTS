import * as angular from "angular";
import { IComponentControllerService } from "angular";
import { PageFields } from "../../../../common/model";
import { DataService } from "../../Services/DataService";
import { PageGridController } from "./page-grid.component.ctrl";

describe("Page grid controller", () => {
    const fakeMouseEvent: any = {
        ctrlKey: false,
        srcElement: {
            attributes: {
                getNamedItem: () => false
            }
        }
    };
    const selectedPage: any = {
        id: 1
    };
    const NewValue = 5;

    /**
     * Common test resources
     */
    let controller: PageGridController;
    let dataServiceToMock: DataService;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject((
        $componentController: IComponentControllerService,
        dataService: DataService) => {
        dataServiceToMock = dataService;
        controller = $componentController("pageGrid", {});
        controller.selectPage(fakeMouseEvent, selectedPage );
        spyOn(dataServiceToMock, "updatePageField");
    }));

    /**
     *
     *  The test cases
     *
     */
    it("A page size change is reported", () => {
        controller.updatePageSize(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.PageSize, [ selectedPage.id ], NewValue);
    });

    it("A print quality change is reported", () => {
        controller.updatePrintQuality(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [ selectedPage.id ], NewValue);
    });

    it("A media type change is reported", () => {
        controller.updateMediaType(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.MediaType, [ selectedPage.id ], NewValue);
    });

    it("A destination change is reported", () => {
        controller.updateDestination(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.Destination, [ selectedPage.id ], NewValue);
    });

});
