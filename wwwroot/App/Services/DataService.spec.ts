import * as angular from "angular";
import "angular-mocks";
import { DataService } from "./DataService"
import { Page } from "../Model/Page";

describe("Data Service Test",
    () => {

        let service: DataService;
        let httpBackend: angular.IHttpBackendService;

        beforeEach(angular.mock.module("myApp"));

        beforeEach(inject((_dataService_, _$httpBackend_) => {
            service = _dataService_;
            httpBackend = _$httpBackend_;
        }));
    
        it("Reads Pages",
            (done) => {
                httpBackend.whenGET('REST/pages').respond(200,[ new Page(1,2,3,4,5) ]);

                service.getPages().then( pages => {
                    expect(pages.length).toBe(1);
                    done();
                });

                httpBackend.flush();
            });
    });