declare const require: any;

// load the code
import "../src/frontend/App/Boot";

// load the mocks
import "angular-mocks";

// load the tests
const contextTS = require.context("../src/frontend/App", true, /\.spec.ts$/);

// And load the modules.
contextTS.keys().map(contextTS);
