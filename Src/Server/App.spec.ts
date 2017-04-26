import * as express from "express";
import { App } from "./App";

describe("App Test", () => {
    it("It can be instantiated", () => {
        var expressInstance = express();
        var newApp = new App(expressInstance);

        expect(newApp.express).toEqual(expressInstance);
    });
});
