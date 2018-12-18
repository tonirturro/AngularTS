// tslint:disable-next-line:no-namespace
declare namespace jasmine {
    // tslint:disable-next-line:interface-name
    interface Matchers<T> {
        toHaveModalsOpen(expected: number): boolean;
        toHaveModalOpenWithContent(content: string, selector: string): boolean;
        toHaveBackdrop(): boolean;
    }
}
