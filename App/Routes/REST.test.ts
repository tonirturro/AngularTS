import * as chai from "chai";
import * as sinon from "sinon";
import { expect } from "chai";
import chaiHttp = require('chai-http');
let app = require('../app');

describe('REST Route', () => {

    const ExpectedPageId = 1;
    const ExpectedDeviceId = 2;
    const ExpectedPageSize = 0;
    const ExpectedPrintQuality = 1;

    var checkRESTResponse = (field: string, done:() => void) => {
        chai.request(app.application)
            .put(`/REST/pages/${field}`)
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    }

    /**
     * Data driven test case to test uodates
     * @param dataFuntionToSpy is the function for the data layer that we want to mock
     * @param field is the REST update field to test
     * @param pageId is the page id to be updated
     * @param newValue is the new value to be update
     * @param done is the test completion callback for Mocha
     */
    var executeAndValidateUpdate = (
        dataFuntionToSpy:string,
        field:string, 
        pageId:number, 
        newValue: number, 
        done:() => void) => {

        var spy = sinon.spy(app.dependencies.dataLayer, dataFuntionToSpy);

        var data = {
            pages : [pageId],
            newValue : newValue
        };

        chai.request(app.application)
            .put(`/REST/pages/${field}`)
            .set('content-type', 'application/json')
            .send(JSON.stringify(data))
            .then(res => {
                expect(spy.calledOnce).true;
                expect(spy.calledWith(pageId,newValue)).true;
                done();
            });
    };

    /**
     * Initialize test environment
     */
    chai.use(chaiHttp);

    /**
     * 
     * The test cases
     * 
     */

     /************************************************************
      * Pages 
      ************************************************************/
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
                expect(spy.calledOnce).true;
                done();
            });
    });

    it("Post pages responds ok", (done) => {
        chai.request(app.application)    
            .post(`/REST/pages/${ExpectedDeviceId}`)
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Post pages calls new page", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'newPage');
        chai.request(app.application)    
            .post(`/REST/pages/${ExpectedDeviceId}`)
            .then(res => {
                expect(spy.calledOnce).true;
                expect(spy.calledWith(ExpectedDeviceId)).true;
                done();
            });
    });

    it("Delete page responds ok", (done) => {
        chai.request(app.application)
            .del(`/REST/pages/${ExpectedPageId}`)
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Delete page calls delete page with the right page number", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'deletePage');
        chai.request(app.application)
            .del(`/REST/pages/${ExpectedPageId}`)
            .then(res => {
                expect(spy.calledOnce).true;
                expect(spy.calledWith(ExpectedPageId)).true;
                done();
            });        
    });

    it("Update page size responds ok", (done) => {
        checkRESTResponse('pageSize', done);
    });

    it("Update page size calls update media size with the right parameters", (done) => {
        executeAndValidateUpdate('updatePageSize', 'pageSize', 10, 0, done);
    });

    it("Update print quality responds ok", (done) => {
        checkRESTResponse('printQuality', done);
    });

    it("Update print quality calls update print quality with the right parameters", (done) => {
        executeAndValidateUpdate('updatePrintQuality', 'printQuality', 15, 1, done);
    });

    it("Update media type responds ok", (done) => {
        checkRESTResponse('mediaType', done);
    });

    it("Update media type calls update media type with the right parameters", (done) => {
        executeAndValidateUpdate('updateMediaType', 'mediaType', 5, 2, done);
    });

    it("Update destination responds ok", (done) => {
        checkRESTResponse('destination', done);
    });

    it("Update destination calls update destination with the right parameters", (done) => {
        executeAndValidateUpdate('updateDestination', 'destination', 20, 0, done);
    });

    /**************************************************************************************
     * Devices
     **************************************************************************************/
    it("Get devices responds ok", (done) => {        
            chai.request(app.application)
                .get("/REST/devices")
                .then(res => {
                    expect(res.status).to.equal(200);
                    done();
                });
    });

    it("Get devices respond calls data", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'getDevices');
        chai.request(app.application)
            .get("/REST/devices")
            .then(res => {
                expect(spy.calledOnce).true;
                done();
            });
    });

    it("Put devices responds ok", (done) => {
        chai.request(app.application)    
            .put("/REST/devices")
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });
    
    it("Put device calls new device", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'newDevice');
        chai.request(app.application)    
            .put("/REST/devices")
            .then(res => {
                expect(spy.calledOnce).true;
                done();
            });
    });

    it("Delete device responds ok", (done) => {
        chai.request(app.application)
            .del(`/REST/devices/${ExpectedDeviceId}`)
            .then(res => {
                expect(res.status).to.equal(200);
                done();
            });
    });

    it("Delete device calls delete device with the right device number", (done) => {
        var spy = sinon.spy(app.dependencies.dataLayer, 'deleteDevice');
        chai.request(app.application)
            .del(`/REST/devices/${ExpectedDeviceId}`)
            .then(res => {
                expect(spy.calledOnce).true;
                expect(spy.calledWith(ExpectedDeviceId)).true;
                done();
            });        
    });
});