import { TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { Diagram } from '../models/diagram.model';
import { DiagramsService } from './diagrams.service';
import { diagramsData } from './diagrams.service.spec-data';

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

describe('DiagramsService', () => {
  let service: DiagramsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [DiagramsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(DiagramsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get a diagram as a Diagram', () => {
    service.getSingleMinimal('diagram1').subscribe((diagram) => {
      expect(diagram).toEqual(jasmine.any(Diagram));
    });

    fakeExternalService._next(diagramsData._embedded.diagrams[1]);
  });

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          diagrams: diagramsData._embedded.diagrams,
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

    it('converts an array the array into Diagram[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((value) => value instanceof Diagram)).toBe(true);
      });

      fakeExternalService._next(getData());
    });
  });
});
