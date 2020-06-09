import { Injectable, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService, Resource } from 'angular4-hal';
import { matchingArgument, FakeExternalService } from 'core/testing';
import { CommonService } from "./common.service"

const testResourcePath = 'resource';

class FakeResource extends Resource {

}

@Injectable()
class FixtureService extends CommonService<FakeResource> {
    constructor(
        injector: Injector,
        externalService: ExternalService
    ) {
        super(FakeResource, testResourcePath, externalService, injector);
    }
}

describe('CommonService', () => {
    let service: FixtureService;
    let externalService: FakeExternalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AngularHalModule.forRoot(),
            ],
            providers: [
                FixtureService,
                {
                    provide: ExternalService,
                    useClass: FakeExternalService
                }
            ]
        }).compileComponents();

        service = TestBed.get(FixtureService);
        externalService = TestBed.get(ExternalService);
    });

    describe(`getSomeMinimalWithSearch`, () => {
        it(`should uri-encode special characters`, () => {
            const someSearchTerm = '#term';
            const encodedSearchTerm = '%23term';

            const result = service.getSomeMinimalWithSearch(someSearchTerm);

            expect(externalService._get).toHaveBeenCalledWith(
                matchingArgument<string>(url => url.includes(encodedSearchTerm) && !url.includes(someSearchTerm))
            );
        });
    });
})