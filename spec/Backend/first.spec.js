var request = require("request");
var fs = require("fs");

var base_url = "http://localhost:3000/";
var modelPath = "/../../Server/data.json";

describe("Test Server", function() {
    it("Get REST API Base Code", function(done) {
        request.get(base_url + "REST", function(error, response, body) {
            expect(response.statusCode).toBe(200);
            done();
        });
    });

    describe("Test Rest API", function() {

        it("Get REST API Base Answer", function(done) {
            request.get(base_url + "REST", function(error, response, body) {
                var receivedData = JSON.parse(body);
                var expectedData = JSON.parse(fs.readFileSync(__dirname + modelPath));

                expect(receivedData.message).toBe(expectedData.message);

                done();
            });
        });

    })
});
