import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { BusinessObjective } from '../models/businessObjective.model';
import { BusinessObjectivesService } from './business-objectives.service';
import { businessObjectiveData } from './business-objectives.service.spec-data';

class FakeExternalService {
  _data = new ReplaySubject<any>();
  _delete = jasmine.createSpy('delete').and.returnValue(this._data.asObservable());
  _get = jasmine.createSpy('get').and.returnValue(this._data.asObservable());
  _post = jasmine.createSpy('post').and.returnValue(this._data.asObservable());
  _next(data: any) {
    this._data.next(data);
  }

  getURL() {
    return '';
  }

  getHttp() {
    const self = this;
    return {
      delete: this._delete,
      get: this._get,
      post: this._post,
    };
  }
}

describe('BusinessObjectivesService', () => {
  let service: BusinessObjectivesService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [BusinessObjectivesService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(BusinessObjectivesService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single business objective from the server into a BusinessObjective; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('businessobjective1000').subscribe((businessObjectives) => {
      expect(businessObjectives).toEqual(jasmine.any(BusinessObjective));
    });

    fakeExternalService._next(businessObjectiveData._embedded.businessObjectives[0]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          businessObjectives: businessObjectiveData._embedded.businessObjectives,
        },
        _links: {
          next: {
            href: 'http://',
          },
        },
        page: {
          number: 0,
          size: 4,
          totalElements: 24,
          totalPages: 6,
        },
      };
    }

    it('defaults for a blank searchForm ', () => {
      service.getSomeMinimalWithSearch().subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=');
    });

    it('defaults to page 0', () => {
      service.getSomeMinimalWithSearch().subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('page=0');
    });

    it('fills in the searchForm ', () => {
      service.getSomeMinimalWithSearch('abc').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=abc&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=abc');
    });

    it('converts an array the array into BusinessObjective[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((graphable) => graphable instanceof BusinessObjective)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no business objectives', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.businessObjectives;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
