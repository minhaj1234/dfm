import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { ImplementationComponent } from '../models/implementationComponent.model';
import { ImplementationComponentsService } from './implementation-components.service';
import { implementationComponentsData } from './implementation-components.service.spec-data';

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

describe('ImplementationComponentsService', () => {
  let service: ImplementationComponentsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [ImplementationComponentsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(ImplementationComponentsService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single implementation component from the server into a ImplementationComponent; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('implementationComponent1000').subscribe((implementationComponent) => {
      expect(implementationComponent).toEqual(jasmine.any(ImplementationComponent));
    });

    fakeExternalService._next(implementationComponentsData._embedded.implementationComponents[0]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          implementationComponents: implementationComponentsData._embedded.implementationComponents,
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

    it('converts an array the array into ImplementationComponent[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((value) => value instanceof ImplementationComponent)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no implementation components', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.implementationComponents;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
