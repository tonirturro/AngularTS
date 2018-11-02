import { expect } from "chai";
import { PageFields } from "../../common/model";
import { Capabilities } from "./Capabilities";

describe("Given a capabilities service", () => {
    let capabilities: Capabilities;

    beforeEach(() => {
        capabilities = new Capabilities();
    });

    it("When getting page size capabilities then they are defined", () => {
        expect(capabilities.getCapabilities(PageFields.PageSize)).to.not.equal(undefined);
    });

    it("When getting page size capabilities then they get as many as supported pages", () => {
        expect(capabilities.getCapabilities(PageFields.PageSize).length).to.equal(Capabilities.PageOptions.length);
    });

    it("When getting page size capabilities then the labels match the supported pages", () => {
        const pageOptions = capabilities.getCapabilities(PageFields.PageSize);
        pageOptions.forEach((option) => {
            expect(Capabilities.PageOptions.indexOf(option.label)).to.be.greaterThan(-1);
        });
    });
});
