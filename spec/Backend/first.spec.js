var request = require("request");
var base_url = "http://localhost:3000/";

describe("Test Server", function() {
    it("Get REST API Base Code", function(done) {
        request.get(base_url + "REST", function(error, response, body) {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    it("Get REST API Base Answer", function(done) {
        request.get(base_url + "REST", function(error, response, body) {
            var data = JSON.parse(body);
            expect(data.message).toBe("Hello World");
            done();
        });
    });
});
