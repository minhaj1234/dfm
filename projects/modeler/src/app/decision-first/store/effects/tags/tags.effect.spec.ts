import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { MessageService } from 'core/services';
import { FakeMessageService } from 'core/testing';
import { FakeExternalService  } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { TagsService } from '../../../services';
import * as fromActions from '../../actions';
import * as fromEffects from './tags.effect';

export class TestActions extends Actions {
  constructor() {
    super(EMPTY);
  }

  set stream(source: Observable<any>) {
    // tslint:disable-next-line
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('Tags Effects', () => {
  let actions$: TestActions;
  let service: TagsService;
  let effects: fromEffects.TagsEffects;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule],
      providers: [
        TagsService,
        fromEffects.TagsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(TagsService);
    effects = TestBed.get(fromEffects.TagsEffects);
    messageService = TestBed.get(MessageService);

    spyOn(service, 'getSingleEdit').and.returnValue(of({ id: '12345' } as any));

    spyOn(messageService, 'handleError');
  });

  describe('loadTag$', () => {
    it('should dispatch LoadTagSuccess', () => {
      const action = new fromActions.LoadTag('12345');
      const completion = new fromActions.LoadTagSuccess({ id: '12345' } as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadTag$).toBeObservable(expected);
    });

    it('should dispatch TagFailure if the service throws an error', () => {
      (service.getSingleEdit as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromActions.LoadTag('12345');
      const completion = new fromActions.TagFailure({ error: new Error('error message'), id: '12345' });

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadTag$).toBeObservable(expected);
    });
  });
});
