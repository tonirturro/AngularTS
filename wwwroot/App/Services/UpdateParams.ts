/**
 * Encapsulates the parameters to perform one field update
 */
export class UpdateParams {
    public pages: number[];
    public newValue: number;
    constructor(pages: number[], newValue: number) {
        this.pages = pages;
        this.newValue = newValue;
    }
}
