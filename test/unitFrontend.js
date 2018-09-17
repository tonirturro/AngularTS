// load the code
require("../src/frontend/App/Boot");

// load the mocks
require("angular-mocks");

// load the tests
const contextTS = require.context("../src/frontend/App", true, /\.spec.ts$/);

// And load the modules.
contextTS.keys().map(contextTS);
