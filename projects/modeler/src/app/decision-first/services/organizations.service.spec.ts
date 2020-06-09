import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { Organization } from '../models/organization.model';
import { OrganizationsService } from './organizations.service';
import { organizationsData } from './organizations.service.spec-data';

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

function getData() {
  return {
    _embedded: {
      organizations: organizationsData._embedded.organizations,
    },
    _links: {
      next: {
        href: 'http://',
      },
    },
    page: {
      number: 0,
      size: 20,
      totalElements: 3,
      totalPages: 1,
    },
  };
}

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [OrganizationsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(OrganizationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get a organization as a Organization', () => {
    service.getSingleMinimal('organization1').subscribe((organization) => {
      expect(organization).toEqual(jasmine.any(Organization));
    });

    fakeExternalService._next(organizationsData._embedded.organizations[1]);
  });

  describe('getSomeMinimalWithSearch', () => {
    it('defaults for a blank searchForm ', () => {
      service.getSomeMinimalWithSearch().subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=');
    });

    it('fills in the searchForm ', () => {
      service.getSomeMinimalWithSearch('abc').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=abc&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=abc');
    });

    it('converts an array the array into Organization[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((org) => org instanceof Organization)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no organizations', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.organizations;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });

  describe('getByUrl', () => {
    it('calls the correct url', () => {
      service.getByUrl('http://').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toEqual('http://');
    });
  });

  it('converts a single organization from the server into a Organization; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('decision2').subscribe((organization) => {
      expect(organization).toEqual(jasmine.any(Organization));
    });

    fakeExternalService._next(organizationsData._embedded.organizations[1]);
  }));
});
