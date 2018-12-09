import { IAugmentedJQuery , IPromise, IScope} from "angular";

interface IResolver {
    resolve(invocables: any, locals: any, parent: any, self: any): any;
}

interface IModalStackService {
    /**
     * Opens a new modal instance.
     */
    open(modalInstance: IModalInstanceService, modal: any): void;

    /**
     * Closes a modal instance with an optional result.
     */
    close(modalInstance: IModalInstanceService, result?: any): void;

    /**
     * Dismisses a modal instance with an optional reason.
     */
    dismiss(modalInstance: IModalInstanceService, reason?: any): void;

    /**
     * Dismiss all open modal instances with an optional reason that will be passed to each instance.
     */
    dismissAll(reason?: any): void;

    /**
     * Gets the topmost modal instance that is open.
     */
    getTop(): IModalStackedMapKeyValuePair;
}

interface IMultiMapFactory {
    createNew(): IMultiMap;
}

interface IMultiMap {
    entries(): any[];
    get(key: string): any;
    hasKey(key: string): boolean;
    keys(): string[];
    put(key: string, value: any);
    remove(key: string, value: any);
}

interface IStackedMapFactory {
    createNew(): IStakedMap;
}

interface IStakedMap {
    add(key: any, value: any);
    get(key: any): any;
    keys(): any[];
    top(): any;
    remove(key: any);
    removeTop();
    length(): number;
}

interface IModalStackedMapKeyValuePair {
    key: IModalInstanceService;
    value: any;
}

interface IModalScope extends IScope {
    /**
     * Dismiss the dialog without assigning a value to the promise output.
     * If `preventDefault` is called on the `modal.closing` event then the modal will remain open.
     *
     * @returns true if the modal was closed; otherwise false
     */
    $dismiss(reason?: any): boolean;

    /**
     * Close the dialog resolving the promise to the given value. If `preventDefault` is called
     * on the `modal.closing` event then the modal will remain open.
     *
     * @returns true if the modal was closed; otherwise false
     */
    $close(result?: any): boolean;
}

export interface IModalSettings {
    /**
     * a path to a template representing modal's content
     */
    templateUrl?: string | (() => string);

    /**
     * inline template representing the modal's content
     */
    template?: string | (() => string);

    /**
     * a scope instance to be used for the modal's content
     * (actually the $modal service is going to create a child scope of a provided scope).
     * Defaults to `$rootScope`.
     */
    scope?: IScope | IModalScope;

    /**
     * a controller for a modal instance - it can initialize scope used by modal.
     * A controller can be injected with `$modalInstance`
     * If value is an array, it must be in Inline Array Annotation format for injection
     * (strings followed by factory method)
     */
    controller?: any;

    /**
     *  an alternative to the controller-as syntax, matching the API of directive definitions.
     *  Requires the controller option to be provided as well
     */
    controllerAs?: string;

    /**
     * When used with controllerAs and set to true, it will bind the controller properties onto the $scope directly.
     *
     * @default false
     */
    bindToController?: boolean;

    /**
     * members that will be resolved and passed to the controller as locals; it is equivalent of the
     * `resolve` property for AngularJS routes. If property value is an array, it must be in Inline
     * Array Annotation format for injection (strings followed by factory method)
     */
    resolve?: { [key: string]: any };

    /**
     * Set to false to disable animations on new modal/backdrop. Does not toggle animations
     * for modals/backdrops that are already displayed.
     *
     * @default true
     */
    animation?: boolean;

    /**
     * controls the presence of a backdrop
     * Allowed values:
     *   - true (default)
     *   - false (no backdrop)
     *   - 'static' backdrop is present but modal window is not closed when clicking outside of the modal window
     *
     * @default true
     */
    backdrop?: boolean | string;

    /**
     * indicates whether the dialog should be closable by hitting the ESC key
     *
     * @default true
     */
    keyboard?: boolean;

    /**
     * additional CSS class(es) to be added to a modal backdrop template
     */
    backdropClass?: string;

    /**
     * additional CSS class(es) to be added to a modal window template
     */
    windowClass?: string;

    /**
     * Optional suffix of modal window class. The value used is appended to the
     * `modal-` class, i.e. a value of `sm` gives `modal-sm`.
     */
    size?: string;

    /**
     * a path to a template overriding modal's window template
     */
    windowTemplateUrl?: string;

    /**
     * The  class added to the body element when the modal is opened.
     *
     * @default 'model-open'
     */
    openedClass?: string;

    /**
     * CSS class(es) to be added to the top modal window.
     */
    windowTopClass?: string;

    /**
     * Appends the modal to a specific element.
     *
     * @default 'body'
     */
    appendTo?: IAugmentedJQuery;

    /**
     * A string reference to the component to be rendered that is registered with Angular's compiler.
     * If using a directive, the directive must have `restrict: 'E'` and a template or templateUrl set.
     *
     * It supports these bindings:
     *   - `close` - A method that can be used to close a modal, passing a result. The result must be
     *      passed in this format: `{$value: myResult}`
     *   - `dismiss` - A method that can be used to dismiss a modal, passing a result.
     *      The result must be passed in this format: `{$value: myRejectedResult}`
     *   - `modalInstance` - The modal instance. This is the same `$uibModalInstance`
     *      injectable found when using `controller`.
     *   - `resolve` - An object of the modal resolve values. See [UI Router resolves] for details.
     */
    component?: string;

    /**
     * Sets the `aria-describedby` property on the modal.
     * The string should be an id (without the leading '#') pointing to the element that describes your modal.
     * @type {string}
     * @memberOf IModalSettings
     */
    ariaDescribedBy?: string;

    /**
     * Sets the `aria-labelledby` property on the modal.
     * The string should be an id (without the leading '#') pointing to the element that labels your modal.
     * @type {string}
     * @memberOf IModalSettings
     */
    ariaLabelledBy?: string;
}

export interface IModalInstanceService {
    /**
     * A promise that is resolved when a modal is closed and rejected when a modal is dismissed.
     */
    result: IPromise<any>;

    /**
     * A promise that is resolved when a modal gets opened after downloading content's
     * template and resolving all variables.
     */
    opened: IPromise<any>;

    /**
     * A promise that is resolved when a modal is rendered.
     */
    rendered: IPromise<any>;

    /**
     * A promise that is resolved when a modal is closed and the animation completes.
     */
    closed: IPromise<any>;

    /**
     * A method that can be used to close a modal, passing a result.
     * If `preventDefault` is called on the `modal.closing` event then the modal will remain open.
     */
    close(result?: any): void;

    /**
     * A method that can be used to dismiss a modal, passing a reason. If `preventDefault`
     * is called on the `modal.closing` event then the modal will remain open.
     */
    dismiss(reason?: any): void;
}

export interface IModalService {
    /**
     * @returns {IPromise}
     */
    getPromiseChain(): IPromise<any>;

    /**
     * @param {IModalSettings} options
     * @returns {IModalInstanceService}
     */
    open(options: IModalSettings): IModalInstanceService;
}
