import { expect } from "chai";
import { IPage } from "../../common/rest";
import { Data } from "./Data";

describe("Data test repository", () => {

    /**
     * Test common resources
     */
    const DeviceId = 1;
    let dataLayer: Data;

   /**
    * Aux method to add pages
    */
    const addPages = (): number => {
        dataLayer.newPage(DeviceId);
        dataLayer.newPage(DeviceId);
        dataLayer.newPage(DeviceId);
        return 3;
    };

    /**
     * Aux method to add devices
     */
    const addDevices = (): number => {
        dataLayer.newDevice();
        dataLayer.newDevice();
        return 2;
    };

    /**
     * Initializes the model and dets the page to be updated
     */
    const getCurrentPage = (): IPage => {
        addPages();
        return dataLayer.getPages()[1];
    };

    /**
     * Initializes the model and gets an invalid id
     */
    const getInvalidId = (): number => {
        addPages();
        let invalidId = 0;
        dataLayer.getPages().forEach((page) => {
            if (page.id > invalidId) {
                invalidId = page.id;
            }
        });

        return ++invalidId;
    };

    /**
     * Initialize test environment
     */
    beforeEach(() => {
        dataLayer = new Data();
    });

    /*
     * The test cases
     */
    it("Has no pages when initialized", () => {
        const pages = dataLayer.getPages();

        expect(pages.length).to.equal(0);
    });

    it("Can add pages", () => {
        dataLayer.newPage(DeviceId);

        const pages = dataLayer.getPages();
        expect(pages.length).to.be.greaterThan(0);
    });

    it("Can delete pages", () => {
        // Add pages and verify them
        const addedPages = addPages();
        let pages = dataLayer.getPages();
        expect(pages.length).equals(addedPages);

        // Delete on page
        const idToDelete = pages[0].id;
        expect(dataLayer.deletePage(idToDelete)).to.equal(true);

        // Verify page deletion
        pages = dataLayer.getPages();
        expect(pages.length).to.be.equal(addedPages - 1);
        expect(pages[0].id).not.to.equal(idToDelete);
    });

    it("Can update page size for an existing page", () => {
        const currentPage = getCurrentPage();
        const newValue = currentPage.pageSize + 1;

        const result = dataLayer.updatePageSize(currentPage.id, newValue);
        const updatedPage = dataLayer.getPages()[1];

        expect(result).equals(true);
        expect(updatedPage.pageSize).to.equal(newValue);
    });

    it("Can't update page size if the page does not exist", () => {
        const result = dataLayer.updatePageSize(getInvalidId(), 0);

        expect(result).equals(false);
    });

    it("Can update print quality for an existing page", () => {
        const currentPage = getCurrentPage();
        const newValue = currentPage.printQuality + 1;

        const result = dataLayer.updatePrintQuality(currentPage.id, newValue);
        const updatedPage = dataLayer.getPages()[1];

        expect(result).equals(true);
        expect(updatedPage.printQuality).to.equal(newValue);
    });

    it("Can't update print quality if the page does not exist", () => {
        const result = dataLayer.updatePrintQuality(getInvalidId(), 0);

        expect(result).equals(false);
    });

    it("Can update media type for an existing page", () => {
        const currentPage = getCurrentPage();
        const newValue = currentPage.mediaType + 1;

        const result = dataLayer.updateMediaType(currentPage.id, newValue);
        const updatedPage = dataLayer.getPages()[1];

        expect(result).equals(true);
        expect(updatedPage.mediaType).to.equal(newValue);
    });

    it("Can't update media type if the page does not exist", () => {
        const result = dataLayer.updateMediaType(getInvalidId(), 0);

        expect(result).equals(false);
    });

    it("Can update destination for an existing page", () => {
        const currentPage = getCurrentPage();
        const newValue = currentPage.destination + 1;

        const result = dataLayer.updateDestination(currentPage.id, newValue);
        const updatedPage = dataLayer.getPages()[1];

        expect(result).equals(true);
        expect(updatedPage.destination).to.equal(newValue);
    });

    it("Can't update destination if the page does not exist", () => {
        const result = dataLayer.updateDestination(getInvalidId(), 0);

        expect(result).equals(false);
    });

    it("Has no devices when initialized", () => {
        const devices = dataLayer.getDevices();

        expect(devices.length).to.equal(0);
    });

    it("Can add devices", () => {
        dataLayer.newDevice();

        const pages = dataLayer.getDevices();
        expect(pages.length).to.be.greaterThan(0);
    });

    it("Can delete devices", () => {
        // Add devices and verify them
        const addedDevices = addDevices();
        let devices = dataLayer.getDevices();
        expect(devices.length).to.be.equal(addedDevices);

        // Delete on device
        const idToDelete = devices[0].id;
        expect(dataLayer.deleteDevice(idToDelete)).equals(true);

        // Verify device deletion
        devices = dataLayer.getDevices();
        expect(devices.length).to.be.equal(addedDevices - 1);
        expect(devices[0].id).not.to.be.equal(idToDelete);
    });

    it("Delete device deletes its pages", () => {
        expect(addDevices()).to.be.greaterThan(1);
        dataLayer.getDevices().forEach((device) => {
            dataLayer.newPage(device.id);
            dataLayer.newPage(device.id);
        });
        const deviceIdToDelete = dataLayer.getDevices()[0].id;

        dataLayer.deleteDevice(deviceIdToDelete);

        // verify no pages for this device
        expect(dataLayer.getPages().length).to.equal(2);
        dataLayer.getPages().forEach((page) => {
            expect(page.deviceId).not.to.be.equal(deviceIdToDelete);
        });
    });
});
