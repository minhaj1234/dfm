import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { TagsService } from './tags.service';

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

describe('TagsService', () => {
  let service: TagsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [TagsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(TagsService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));
});
