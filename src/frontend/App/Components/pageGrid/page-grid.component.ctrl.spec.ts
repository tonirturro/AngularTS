import * as angular from "angular";
import { IComponentControllerService } from "angular";
import { PageFields } from "../../../../common/model";
import { DataService } from "../../Services/DataService";
import { PageGridController } from "./page-grid.component.ctrl";

describe("Given a page grid controller", () => {
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
    const NewValue = "1";

    /**
     * Common test resources
     */
    let controller: PageGridController;
    let dataServiceToMock: DataService;

    /**
     * Initialize the test environment
     */
    beforeEach(angular.mock.module("myApp.components"));

    beforeEach(inject((
        $componentController: IComponentControllerService,
        dataService: DataService) => {
        dataServiceToMock = dataService;
        controller = $componentController("pageGrid", {});
        controller.selectPage(fakeMouseEvent, selectedPage.id );
        spyOn(dataServiceToMock, "updatePageField");
    }));

    /**
     *
     *  The test cases
     *
     */
    it("When changing page size Then the corresponding update model call is made", () => {
        controller.updatePageSize(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.PageSize, [ selectedPage.id ], NewValue);
    });

    it("When changing print quality Then the corresponding update model call is made", () => {
        controller.updatePrintQuality(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.PrintQuality, [ selectedPage.id ], NewValue);
    });

    it("When changing media type Then the corresponding update model call is made", () => {
        controller.updateMediaType(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.MediaType, [ selectedPage.id ], NewValue);
    });

    it("When changing destination Then the corresponding update model call is made", () => {
        controller.updateDestination(NewValue);

        expect(dataServiceToMock.updatePageField)
            .toHaveBeenCalledWith(PageFields.Destination, [ selectedPage.id ], NewValue);
    });

});
