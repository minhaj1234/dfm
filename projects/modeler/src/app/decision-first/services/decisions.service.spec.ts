import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { Decision } from '../models/decision.model';
import { DecisionsService } from './decisions.service';
import { decisionsData } from './decisions.service.spec-data';

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

describe('DecisionsService', () => {
  let service: DecisionsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [DecisionsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(DecisionsService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single minimal decisions from the server into a Decision; this makes sure links are sanitized', async(() => {
    service.getSingleMinimal('decision2').subscribe((decision) => {
      expect(decision).toEqual(jasmine.any(Decision));
    });

    fakeExternalService._next(decisionsData._embedded.decisions[1]);
  }));

  it('converts a single decisions to diagram from the server into a Decision; this makes sure links are sanitized', async(() => {
    service.getSingleObjectForDiagram('decision2').subscribe((decision) => {
      expect(decision).toEqual(jasmine.any(Decision));
    });

    fakeExternalService._next(decisionsData._embedded.decisions[1]);
  }));

  it('converts a single decisions to edit from the server into a Decision; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('decision2').subscribe((decision) => {
      expect(decision).toEqual(jasmine.any(Decision));
    });

    fakeExternalService._next(decisionsData._embedded.decisions[1]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          decisions: decisionsData._embedded.decisions,
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

    it('converts an array the array into Decision[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((graphable) => graphable instanceof Decision)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no decisions', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.decisions;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
