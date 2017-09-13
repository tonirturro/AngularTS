import { expect } from "chai";
import { Data } from "./Data";
import { Page } from "../Model/Page";

describe("Data test repository", () => {

    /**
     * Test common resources
     */
    const DeviceId = 1;
    var dataLayer: Data;

    /**
    * Aux method to add pages
    */
    var addPages = ():number => {
        dataLayer.newPage(DeviceId);
        dataLayer.newPage(DeviceId);
        dataLayer.newPage(DeviceId);
        return 3;
    }

    /**
     * Aux method to add devices
     */
    var addDevices = ():number => {
        dataLayer.newDevice();
        dataLayer.newDevice();
        return 2;
    }

    /**
     * Initializes the model and dets the page to be updated
     */
    var getCurrentPage = ():Page => {
        addPages();
        return dataLayer.getPages()[1];
    }

    /**
     * Initializes the model and gets an invalid id
     */
    var getInvalidId = ():number => {
        addPages();
        var invalidId = 0;
        dataLayer.getPages().forEach(page => {
            if (page.id > invalidId) {
                invalidId = page.id;
            }
        });

        return ++invalidId;
    }

    /**
     * Initialize test environment
     */
    beforeEach(() => {
        dataLayer = new Data();
    });

    /**
     * 
     * The test cases
     * 
     */
    it("Has no pages when initialized", () => {
        var pages = dataLayer.getPages();

        expect(pages).to.be.empty;
    });

    it("Can add pages", () => {
        dataLayer.newPage(DeviceId);

        var pages = dataLayer.getPages();
        expect(pages).not.to.be.empty;
    });

    it("Can delete pages", () => {
        // Add pages and verify them
        var addedPages = addPages();
        var pages = dataLayer.getPages();
        expect(pages.length).to.be.equal(addedPages);

        // Delete on page
        var idToDelete = pages[0].id;
        expect(dataLayer.deletePage(idToDelete)).to.be.true;

        // Verify page deletion
        pages = dataLayer.getPages();
        expect(pages.length).to.be.equal(addedPages - 1);
        expect(pages[0].id).not.to.be.equal(idToDelete);
    });

    it("Can update page size for an existing page", () => {
        var currentPage = getCurrentPage();
        var newValue = currentPage.pageSize + 1;

        var result = dataLayer.updatePageSize(currentPage.id, newValue);
        var updatedPage = dataLayer.getPages()[1];

        expect(result).to.be.true;
        expect(updatedPage.pageSize).to.equal(newValue);
    });

    it("Can't update page size if the page does not exist", () => {
        var result = dataLayer.updatePageSize(getInvalidId(), 0);

        expect(result).to.be.false;
    });

    it("Can update print quality for an existing page", () => {
        var currentPage = getCurrentPage();
        var newValue = currentPage.printQuality + 1;

        var result = dataLayer.updatePrintQuality(currentPage.id, newValue);
        var updatedPage = dataLayer.getPages()[1];

        expect(result).to.be.true;
        expect(updatedPage.printQuality).to.equal(newValue);
    });

    it("Can't update print quality if the page does not exist", () => {
        var result = dataLayer.updatePrintQuality(getInvalidId(), 0);

        expect(result).to.be.false;
    });

    it("Can update media type for an existing page", () => {
        var currentPage = getCurrentPage();
        var newValue = currentPage.mediaType + 1;

        var result = dataLayer.updateMediaType(currentPage.id, newValue);
        var updatedPage = dataLayer.getPages()[1];

        expect(result).to.be.true;
        expect(updatedPage.mediaType).to.equal(newValue);
    });

    it("Can't update media type if the page does not exist", () => {
        var result = dataLayer.updateMediaType(getInvalidId(), 0);

        expect(result).to.be.false;
    });

    it("Can update destination for an existing page", () => {
        var currentPage = getCurrentPage();
        var newValue = currentPage.destination + 1;

        var result = dataLayer.updateDestination(currentPage.id, newValue);
        var updatedPage = dataLayer.getPages()[1];

        expect(result).to.be.true;
        expect(updatedPage.destination).to.equal(newValue);
    });

    it("Can't update destination if the page does not exist", () => {
        var result = dataLayer.updateDestination(getInvalidId(), 0);

        expect(result).to.be.false;
    });

    it("Has no devices when initialized", () => {
        var devices = dataLayer.getDevices();
        
        expect(devices).to.be.empty;
    });

    it("Can add devices", () => {
        dataLayer.newDevice();

        var pages = dataLayer.getDevices();
        expect(pages).not.to.be.empty;
    });

    it("Can delete devices", () => {
        // Add devices and verify them
        var addedDevices = addDevices();
        var devices = dataLayer.getDevices();
        expect(devices.length).to.be.equal(addedDevices);

        // Delete on device
        var idToDelete = devices[0].id;
        expect(dataLayer.deleteDevice(idToDelete)).to.be.true;

        // Verify device deletion
        devices = dataLayer.getDevices();
        expect(devices.length).to.be.equal(addedDevices - 1);
        expect(devices[0].id).not.to.be.equal(idToDelete);
    });

    it("Delete device deletes its pages", () => {
        expect(addDevices()).to.be.greaterThan(1);
        dataLayer.getDevices().forEach(device => {
            dataLayer.newPage(device.id);
            dataLayer.newPage(device.id);
        });
        var deviceIdToDelete = dataLayer.getDevices()[0].id;

        dataLayer.deleteDevice(deviceIdToDelete);

        // verify no pages for this device
        expect(dataLayer.getPages()).not.to.be.empty;
        dataLayer.getPages().forEach(page =>{
            expect(page.deviceId).not.to.be.equal(deviceIdToDelete);
        });
    });
});
