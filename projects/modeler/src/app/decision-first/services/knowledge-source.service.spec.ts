import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { KnowledgeSourceService } from './knowledge-source.service';
import { knowledgeSourcesData } from './knowledge-source.service.spec-data';

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

describe('KnowledgeSourceService', () => {
  let service: KnowledgeSourceService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [KnowledgeSourceService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(KnowledgeSourceService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single minimal knowledge source from the server into a KnowledgeSource; this makes sure links are sanitized', async(() => {
    service.getSingleMinimal('knowledgeSource2').subscribe((knowledgeSource) => {
      expect(knowledgeSource).toEqual(jasmine.any(KnowledgeSource));
    });

    fakeExternalService._next(knowledgeSourcesData._embedded.knowledgeSources[1]);
  }));

  it('converts a single knowledge source to diagram from the server into a KnowledgeSource; this makes sure links are sanitized', async(() => {
    service.getSingleObjectForDiagram('knowledgeSource2').subscribe((knowledgeSource) => {
      expect(knowledgeSource).toEqual(jasmine.any(KnowledgeSource));
    });

    fakeExternalService._next(knowledgeSourcesData._embedded.knowledgeSources[1]);
  }));

  it('converts a single knowledge source to edit from the server into a KnowledgeSource; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('knowledgeSource2').subscribe((knowledgeSource) => {
      expect(knowledgeSource).toEqual(jasmine.any(KnowledgeSource));
    });

    fakeExternalService._next(knowledgeSourcesData._embedded.knowledgeSources[1]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          knowledgeSources: knowledgeSourcesData._embedded.knowledgeSources,
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

    it('defaults for a blank searchForm', () => {
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

    it('fills in the searchForm', () => {
      service.getSomeMinimalWithSearch('test').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialName=test&');
      expect(fakeExternalService._get.calls.first().args[0]).toContain('partialDescription=test');
    });

    it('converts an array the array into KnowledgeSource[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((value) => value instanceof KnowledgeSource)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no knowledge sources', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.knowledgeSources;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
