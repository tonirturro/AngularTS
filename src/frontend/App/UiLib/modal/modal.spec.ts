import * as angular from "angular";
import { IDocumentService, IRootScopeService } from "angular";
import { IModalInstanceService, IModalService, IModalSettings } from "../definitions";

const DialogCustomMatchers: jasmine.CustomMatcherFactories = {
    toHaveBackdrop: (
        util: jasmine.MatchersUtil,
        customEqualityTesters: jasmine.CustomEqualityTester[]) => {
        return {
          compare: (actual, expected) => {
            const backdropDomEls = actual.find("body > div.modal-backdrop");

            const result = {
              message: undefined,
              pass: util.equals(backdropDomEls.length, 1, customEqualityTesters)
            };

            if (result.pass) {
              result.message = `Expected ${angular.mock.dump(backdropDomEls)} not to be a backdrop element".`;
            } else {
              result.message = `Expected ${angular.mock.dump(backdropDomEls)} to be a backdrop element".`;
            }

            return result;
          }
        };
    },
    toHaveModalOpenWithContent: (
        util: jasmine.MatchersUtil,
        customEqualityTesters: jasmine.CustomEqualityTester[]) => {
        return {
            compare: (actual, content, selector) => {
                let contentToCompare;
                const modalDomEls = actual.find("body > div.modal > div.modal-dialog > div.modal-content");

                contentToCompare = selector ? modalDomEls.find(selector) : modalDomEls;

                const result = {
                    message: undefined,
                    pass: modalDomEls.css("display") === "block" && contentToCompare.html() === content
                };

                if (result.pass) {
                    result.message = `Expected ${angular.mock.dump(modalDomEls)} not to be open with ${content}.`;
                } else {
                    result.message = `Expected ${angular.mock.dump(modalDomEls)} to be open with ${content}.`;
                }

                return result;
            }
        };
    },
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

    const open = (modalOptions: IModalSettings, noFlush?: boolean, noDigest?: boolean) => {
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

    const dismiss = (modal: IModalInstanceService, reason: any, noFlush?: boolean) => {
        const closed = modal.dismiss(reason);
        rootScope.$digest();
        if (!noFlush) {
          animate.flush();
          rootScope.$digest();
          animate.flush();
          rootScope.$digest();
        }
        return closed;
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

    afterEach(() => {
        const body = document.find("body");
        body.find("div.modal").remove();
        body.find("div.modal-backdrop").remove();
        body.removeClass("modal-open");
        document.off("keydown");
    });

    describe("and basic scenarios with default options", () => {
        it("should open and dismiss a modal with a minimal set of options", () => {
            const modal = open({ template: "<div>Content</div>" });

            expect(document).toHaveModalsOpen(1);
            expect(document).toHaveModalOpenWithContent("Content", "div");
            expect(document).toHaveBackdrop();

            dismiss(modal, "closing in test");

            expect(document).toHaveModalsOpen(0);
            expect(document).not.toHaveBackdrop();
        });
    });
});
