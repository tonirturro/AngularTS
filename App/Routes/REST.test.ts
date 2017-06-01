import * as chai from "chai";
import { expect } from "chai";
import chaiHttp = require('chai-http');
let app = require('../app');

describe('REST Route', () => {

    chai.use(chaiHttp);

    it("Gets pages", (done) => {

        chai.request(app)
            .get("/REST/pages")
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    })
});