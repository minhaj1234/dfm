import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { matchingArgument } from 'core/testing';
import { ReplaySubject } from 'rxjs';
import { ObjectClassNames } from '../models/objects.model';
import { defaultSearchFilterTypeObjects, defaultSearchSort, Search, SearchSort } from '../models/search.model';
import { businessObjectiveData } from './business-objectives.service.spec-data';
import { decisionsData } from './decisions.service.spec-data';
import { diagramsData } from './diagrams.service.spec-data';
import { eventData } from './events.service.spec-data';
import { implementationComponentsData } from './implementation-components.service.spec-data';
import { inputDatasData } from './input-data.service.spec-data';
import { knowledgeSourcesData } from './knowledge-source.service.spec-data';
import { organizationsData } from './organizations.service.spec-data';
import { processData } from './processes.service.spec-data';
import { RepositoryService } from './repository.service';
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

function getData() {
  return {
    _embedded: [
      ...businessObjectiveData._embedded.businessObjectives,
      ...decisionsData._embedded.decisions,
      ...diagramsData._embedded.diagrams,
      ...eventData._embedded.events,
      ...implementationComponentsData._embedded.implementationComponents,
      ...inputDatasData._embedded.inputDatas,
      ...knowledgeSourcesData._embedded.knowledgeSources,
      ...organizationsData._embedded.organizations,
      ...processData._embedded.processes,
      ...systemData._embedded.systems,
    ],
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

describe('RepositoryService', () => {
  let service: RepositoryService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [RepositoryService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(RepositoryService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  describe('getSomeMinimalWithSearch', () => {
    it('defaults for a blank searchForm ', () => {
      service.getSomeMinimalWithSearch().subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=');
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`types=${defaultSearchFilterTypeObjects}`);
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`sort=name,${defaultSearchSort}`);
    });

    it('fills type objects', () => {
      service.getSomeMinimalWithSearch('', [ObjectClassNames.Decision, ObjectClassNames.Process]).subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=');
      expect(fakeExternalService._get.calls.first().args[0]).toContain(
        `types=${[ObjectClassNames.Decision, ObjectClassNames.Process].toString()}`,
      );
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`sort=name,${defaultSearchSort}`);
    });

    it('fills sort', () => {
      service.getSomeMinimalWithSearch('', [], SearchSort.Desc).subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=');
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`types=${defaultSearchFilterTypeObjects}`);
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`sort=name,${SearchSort.Desc}`);
    });

    it('fills in the searchForm ', () => {
      service.getSomeMinimalWithSearch('abc').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=abc&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=abc');
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`types=${defaultSearchFilterTypeObjects}`);
      expect(fakeExternalService._get.calls.first().args[0]).toContain(`sort=name,${defaultSearchSort}`);
    });

    it(`should uri-encode special characters`, () => {
      const someSearchTerm = '#term';
      const encodedSearchTerm = '%23term';

      const result = service.getSomeMinimalWithSearch(someSearchTerm);

      expect(fakeExternalService._get).toHaveBeenCalledWith(
        matchingArgument<string>(url => url.includes(encodedSearchTerm) && !url.includes(someSearchTerm))
      );
    });
  });

  describe('getByUrl', () => {
    it('calls the correct url', () => {
      service.getByUrl('http://').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toEqual('http://');
    });
  });
});
