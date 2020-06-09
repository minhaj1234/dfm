import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { matchingArgument } from 'core/testing';
import { ReplaySubject } from 'rxjs';
import { Config } from '../../config';
import { Decision } from '../models/decision.model';
import { InputData } from '../models/inputData.model';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { ObjectClassNames, ObjectRelationsNames } from '../models/objects.model';
import { assembleResults, DiagrammingElementsService } from './diagramming-elements.service';

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
      {
        id: 'decision1',
        type: 'decisions'
      },
      {
        id: 'decision2',
        type: 'decisions'
      },
      {
        id: 'inputdata1',
        type: 'inputDatas'
      },
      {
        id: 'knowledgesource1',
        type: 'knowledgeSources'
      },
      {
        id: 'knowledgesource2',
        type: 'knowledgeSources'
      }
    ],
    _links: {
      next: {
        href: 'http://',
      },
    },
    page: {
      number: 0,
      size: 1,
      totalElements: 5,
      totalPages: 1,
    },
  };
}

describe('DiagrammingElementsService', () => {
  let service: DiagrammingElementsService;
  let fakeExternalService: FakeExternalService;
  const diagrammingElementTypes = [
    ObjectClassNames.Decision,
    ObjectClassNames.InputData,
    ObjectClassNames.KnowledgeSource
  ];

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [DiagrammingElementsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(DiagrammingElementsService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  describe('getSomeMinimalWithSearch', () => {
    it('defaults for a blank searchForm ', () => {
      service.getSomeMinimalWithSearch().subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0])
        .toContain(`partialName=&partialDescription=&size=${Config.pageSize}&types=${diagrammingElementTypes.toString()}&excludeIds=&sort=name`);
    });

    it('fills in the searchForm ', () => {
      service.getSomeMinimalWithSearch('abc').subscribe();

      fakeExternalService._next(getData());

      expect(fakeExternalService._get.calls.first().args[0])
        .toContain(`partialName=abc&partialDescription=abc&size=${Config.pageSize}&types=${diagrammingElementTypes.toString()}&excludeIds=&sort=name`);
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

  describe('assembleResults', () => {
    it('converts an array of mixed graphables into their correct classes', () => {
      expect(
        assembleResults(getData()).results.every(
          (graphable) =>
            graphable instanceof Decision ||
            graphable instanceof InputData ||
            graphable instanceof KnowledgeSource
        ),
      ).toBe(true);
    });

    it('does not fail if there are no decisions', () => {
      const data = getData();
      data._embedded = data._embedded.filter(x => x.type !== ObjectRelationsNames.Decisions);

      expect(assembleResults(data).results.every((graphable) =>
        graphable instanceof InputData || graphable instanceof KnowledgeSource)).toBe(true);
    });

    it('does not fail if there are no input data', () => {
      const data = getData();
      data._embedded = data._embedded.filter(x => x.type !== ObjectRelationsNames.InputDatas);

      expect(assembleResults(data).results.every((graphable) =>
        graphable instanceof Decision || graphable instanceof KnowledgeSource)).toBe(true);
    });

    it('does not fail if there are no knowledge sources', () => {
      const data = getData();
      data._embedded = data._embedded.filter(x => x.type !== ObjectRelationsNames.KnowledgeSources);

      expect(assembleResults(data).results.every((graphable) =>
        graphable instanceof Decision || graphable instanceof InputData)).toBe(true);
    });

    it('adds the nextUrl if it exists', () => {
      expect(assembleResults(getData()).pagination.nextUrl).toEqual('http://');
    });

    it('still works if the nextUrl is not set', () => {
      const data = getData();
      delete data._links.next;
      expect(assembleResults(data)).toBeTruthy();
    });
  });
});
