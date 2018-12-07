import { IResolver } from "../definitions";

export class Resolve implements IResolver {
    public resolve(invocables: any, locals: any, parent: any, self: any): any {
        return {};
    }
}
