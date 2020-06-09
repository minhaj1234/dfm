import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { blankPages } from 'core/models';
import { ReplaySubject } from 'rxjs';
import { System } from '../models/system.model';
import { SystemsService } from './systems.service';
import { systemData } from './systems.service.spec-data';

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

describe('SystemsService', () => {
  let service: SystemsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [SystemsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(SystemsService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single systems from the server into a System; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('system1000').subscribe((systems) => {
      expect(systems).toEqual(jasmine.any(System));
    });

    fakeExternalService._next(systemData._embedded.systems[0]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          systems: systemData._embedded.systems,
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

    it('converts an array the array into System[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((graphable) => graphable instanceof System)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no systems', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.systems;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
