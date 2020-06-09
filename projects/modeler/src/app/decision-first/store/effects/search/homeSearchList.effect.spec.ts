import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { DiagramsService } from '../../../services';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromHomeSearchListActions from '../../actions/search/homeSearchList.actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './homeSearchList.effect';

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

describe('Home Search List Effects', () => {
  let actions$: TestActions;
  let service: DiagramsService;
  let effects: fromEffects.HomeSearchListEffects;
  let store: Store<IDecisionFirstState>;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        DiagramsService,
        fromEffects.HomeSearchListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(DiagramsService);
    effects = TestBed.get(fromEffects.HomeSearchListEffects);
    store = TestBed.get(Store);
    messageService = TestBed.get(MessageService);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({} as any));
    spyOn(service, 'getByUrl').and.returnValue(of({} as any));
    spyOn(messageService, 'handleError');
  });

  describe('loadHomeSearchList$', () => {
    it('should dispatch LoadHomeSearchListSuccess', () => {
      const action = new fromHomeSearchListActions.LoadHomeSearchList();
      const completion = new fromHomeSearchListActions.LoadHomeSearchListSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadHomeSearchList$).toBeObservable(expected);
    });

    it('should dispatch HomeSearchListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromHomeSearchListActions.LoadHomeSearchList();
      const completion = new fromHomeSearchListActions.HomeSearchListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadHomeSearchList$).toBeObservable(expected);
    });
  });

  describe('updateSearchForHomeSearchList$', () => {
    it('should dispatch LoadHomeSearchListSuccess', () => {
      const action = new fromHomeSearchListActions.UpdateSearchForHomeSearchList({ searchTerm: '' });
      const completion = new fromHomeSearchListActions.LoadHomeSearchListSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateHomeSearchForSearchList$).toBeObservable(expected);
    });

    it('should dispatch HomeSearchListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromHomeSearchListActions.UpdateSearchForHomeSearchList({ searchTerm: '' });
      const completion = new fromHomeSearchListActions.HomeSearchListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateHomeSearchForSearchList$).toBeObservable(expected);
    });
  });
});
