import { async, TestBed } from '@angular/core/testing';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ReplaySubject } from 'rxjs';
import { Event } from '../models/events.model';
import { EventsService } from './events.service';
import { eventData } from './events.service.spec-data';

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

describe('EventsService', () => {
  let service: EventsService;
  let fakeExternalService: FakeExternalService;

  beforeEach(async(() => {
    fakeExternalService = new FakeExternalService();
    TestBed.configureTestingModule({
      imports: [AngularHalModule.forRoot()],
      providers: [EventsService, { provide: ExternalService, useValue: fakeExternalService }],
    });
    service = TestBed.get(EventsService);
  }));

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  it('converts a single event from the server into a Event; this makes sure links are sanitized', async(() => {
    service.getSingleEdit('event1000').subscribe((events) => {
      expect(events).toEqual(jasmine.any(Event));
    });

    fakeExternalService._next(eventData._embedded.events[0]);
  }));

  describe('getSomeMinimalWithSearch', () => {
    function getData() {
      return {
        _embedded: {
          events: eventData._embedded.events,
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

    it('converts an array the array into Event[]', () => {
      service.getSomeMinimalWithSearch().subscribe((response) => {
        expect(response.results.every((graphable) => graphable instanceof Event)).toBe(true);
      });

      fakeExternalService._next(getData());
    });

    it('does not fail if there are no events', () => {
      let results;

      service.getSomeMinimalWithSearch().subscribe((response) => {
        results = response;
      });

      const data = getData();
      delete data._embedded.events;

      fakeExternalService._next(data);

      expect(results.results).toEqual([]);
    });
  });
});
