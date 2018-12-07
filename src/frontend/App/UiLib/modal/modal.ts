import { IDocumentService, IPromise, IQService, ITemplateRequestService } from "angular";
import * as angular from "angular";
import { IModalInstanceService, IModalService, IModalSettings, IModalStackService, IResolver } from "../definitions";

export class UiLibModal implements IModalService {

    public static $inject = [ "$q", "$document", "$templateRequest", "$uibModalStack" , "$uibResolve"];

    private readonly options = {
        animation: true,
        backdrop: true, // can also be false or 'static'
        keyboard: true
    };

    constructor(
        private $q: IQService,
        private $document: IDocumentService,
        private $templateRequest: ITemplateRequestService,
        private $modalStack: IModalStackService,
        private $uibResolve: IResolver) { }

    /**
     * TBD
     */
    public getPromiseChain(): IPromise<any> {
        throw new Error("Method not implemented.");
    }

    /**
     * Creates a modal dialog instance
     * @param modalOptions defines the dialog properties
     */
    public open(modalOptions: IModalSettings): IModalInstanceService {
        const modalResultDeferred = this.$q.defer();
        const modalOpenedDeferred = this.$q.defer();
        const modalClosedDeferred = this.$q.defer();
        const modalRenderDeferred = this.$q.defer();

        // prepare an instance of a modal to be injected into controllers and returned to a caller
        const modalInstance = {
            close: (result) => {
                return this.$modalStack.close(modalInstance, result);
            },
            closed: modalClosedDeferred.promise,
            dismiss: (reason) => {
                return this.$modalStack.dismiss(modalInstance, reason);
            },
            opened: modalOpenedDeferred.promise,
            rendered: modalRenderDeferred.promise,
            result: modalResultDeferred.promise
        };

        // merge and clean up options
        modalOptions = angular.extend({}, this.options, modalOptions);
        modalOptions.resolve = modalOptions.resolve || {};
        modalOptions.appendTo = modalOptions.appendTo || this.$document.find("body").eq(0);

        if (!modalOptions.appendTo.length) {
            throw new Error("appendTo element not found. Make sure that the element passed is in DOM.");
        }

        // verify options
        if (!modalOptions.component && !modalOptions.template && !modalOptions.templateUrl) {
            throw new Error("One of component or template or templateUrl options is required.");
        }

        let templateAndResolvePromise;
        if (modalOptions.component) {
          templateAndResolvePromise = this.$q.when(this.$uibResolve.resolve(modalOptions.resolve, {}, null, null));
        } else {
          templateAndResolvePromise =
            this.$q.all([
                this.getTemplatePromise(modalOptions),
                this.$uibResolve.resolve(modalOptions.resolve, {}, null, null)]);
        }

        return {} as IModalInstanceService;
    }

    private getTemplatePromise(options: IModalSettings) {
        return options.template ? this.$q.when(options.template) :
          this.$templateRequest(angular.isFunction(options.templateUrl) ?
            options.templateUrl() : options.templateUrl);
      }

}
