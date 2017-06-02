import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";
import chaiHttp = require('chai-http');
let app = require('../app');

describe('REST Route', () => {

    chai.use(chaiHttp);

    it("Get pages responds ok", (done) => {

        chai.request(app.application)
            .get("/REST/pages")
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Get pages respond calls data", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'getPages');
        chai.request(app.application)
            .get("/REST/pages")
            .then(res => {
                expect(spy.calledOnce).to.be.true;
                done();
            });
    });

    it("Put pages responds ok", (done) => {
        chai.request(app.application)    
            .put("/REST/pages")
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Put pages calls new page", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'newPage');
        chai.request(app.application)    
            .put("/REST/pages")
            .then(res => {
                expect(spy.calledOnce).to.be.true;
                done();
            });
    });

    it("Delete page responds ok", (done) => {
        chai.request(app.application)
            .del("/REST/pages/1")
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Delete page calls delete page with the right page number", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'deletePage');
        chai.request(app.application)
            .del("/REST/pages/1")
            .then(res => {
                expect(spy.calledOnce).to.be.true;
                expect(spy.calledWith(1)).to.be.true;
                done();
            });        
    });
});