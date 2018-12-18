import * as angular from "angular";
import { IDocumentService, IRootScopeService } from "angular";
import "angular-animate";
import { IModalInstanceService, IModalService, IModalSettings } from "../definitions";

const DialogCustomMatchers: jasmine.CustomMatcherFactories = {
    toHaveModalsOpen: (
        util: jasmine.MatchersUtil,
        customEqualityTesters: jasmine.CustomEqualityTester[]): jasmine.CustomMatcher => {
        return {
            compare: (actual, expected) => {
                const modalDomEls = actual.find("body > div.modal");

                const result = {
                    message: undefined,
                    pass: util.equals(modalDomEls.length, expected, customEqualityTesters)
                };

                if (result.pass) {
                    result.message = `Expected ` +
                        `"${angular.mock.dump(modalDomEls)}" not to have ` +
                        `"${expected}" modals opened`;
                } else {
                    result.message = `Expected ` +
                        `"${angular.mock.dump(modalDomEls)}" to have` +
                        `"${expected}" modals opened`;
                }

                return result;
            }
        };
    }
};

describe("Given a modal service", () => {
    let serviceToTest: IModalService;
    let rootScope: IRootScopeService;
    let animate: angular.animate.IAnimateService;
    let document: IDocumentService;

    const open = (modalOptions: IModalSettings, noFlush: boolean, noDigest: boolean) => {
        const modal: IModalInstanceService = serviceToTest.open(modalOptions);
        modal.opened.catch(angular.noop);
        modal.result.catch(angular.noop);
        if (!noDigest) {
            rootScope.$digest();
            if (!noFlush) {
                 animate.flush();
            }
        }
        return modal;
    };

    beforeEach(angular.mock.module("ngAnimateMock"));
    beforeEach(angular.mock.module("ui-lib"));

    beforeEach(inject((
        $uiLibModal: IModalService,
        $rootScope: IRootScopeService,
        $animate: angular.animate.IAnimateService,
        $document: IDocumentService) => {
        serviceToTest = $uiLibModal;
        rootScope = $rootScope;
        animate = $animate;
        document = $document;
    }));

    beforeEach(() => {
        jasmine.addMatchers(DialogCustomMatchers);
    });

    describe("and basic scenarios with default options", () => {
        it("should open and dismiss a modal with a minimal set of options", () => {
            open({ template: "<div>Content</div>" }, false, false);

            expect(document).toHaveModalsOpen(1);
        });
    });
});
