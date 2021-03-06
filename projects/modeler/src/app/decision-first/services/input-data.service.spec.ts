import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { InputData } from '../models/inputData.model';
import { InputDatasService } from './input-data.service';
import { inputDatasData } from './input-data.service.spec-data';

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

describe('InputDatasService', () => {
  let service: InputDatasService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [InputDatasService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(InputDatasService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single minimal input data from the server into a InputData; this makes sure links are sanitized', async(() => {
    service.getSingleMinimal('inputdata1').subscribe((inputData) => {
      expect(inputData).toEqual(jasmine.any(InputData));
    });

    fakeExternalService._next(inputDatasData._embedded.inputDatas[0]);
  }));

  it('converts a single input data to diagram from the server into a InputData; this makes sure links are sanitized', async(() => {
    service.getSingleObjectForDiagram('inputdata1').subscribe((inputData) => {
      expect(inputData).toEqual(jasmine.any(InputData));
    });

    fakeExternalService._next(inputDatasData._embedded.inputDatas[0]);
  }));

  it('converts a single input data to edit from the server into a InputData; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('inputdata1').subscribe((inputData) => {
      expect(inputData).toEqual(jasmine.any(InputData));
    });

    fakeExternalService._next(inputDatasData._embedded.inputDatas[0]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          inputDatas: inputDatasData._embedded.inputDatas,
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

    it('converts an array the array into InputData[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((graphable) => graphable instanceof InputData)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no input datas', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.inputDatas;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
