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
import { DecisionsService, DiagramsService, KnowledgeSourceService, OrganizationsService } from '../../../services';
import { RepositoryService } from '../../../services/repository.service';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromActions from '../../actions';
import * as fromMainSearchListActions from '../../actions/search/mainSearchList.actions';
import * as fromReducers from '../../reducers';
import { IDecisionFirstState } from '../../reducers';
import * as fromEffects from './mainSearchList.effect';

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

describe('Search List Effects', () => {
  let actions$: TestActions;
  let service: RepositoryService;
  let effects: fromEffects.MainSearchListEffects;
  let store: Store<IDecisionFirstState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularHalModule,
        TestStoreModule,
      ],
      providers: [
        RepositoryService,
        KnowledgeSourceService,
        DecisionsService,
        DiagramsService,
        OrganizationsService,
        fromEffects.MainSearchListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(RepositoryService);
    effects = TestBed.get(fromEffects.MainSearchListEffects);
    store = TestBed.get(Store);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({} as any));
    spyOn(service, 'getByUrl').and.returnValue(of({} as any));
  });

  describe('loadMainSearchList$', () => {
    it('should dispatch LoadMainSearchListSuccess', () => {
      const action = new fromMainSearchListActions.LoadMainSearchList();
      const completion = new fromMainSearchListActions.LoadMainSearchListSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadMainSearchList$).toBeObservable(expected);
    });

    it('should dispatch MainSearchListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromMainSearchListActions.LoadMainSearchList();
      const completion = new fromMainSearchListActions.MainSearchListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadMainSearchList$).toBeObservable(expected);
    });
  });

  describe('mainSearchListFailure$', () => {
    it('should dispatch nothing but call toastr.error', () => {
      spyOn(TestBed.get(MessageService), 'handleError');
      const action = new fromActions.MainSearchListFailure(new Error('error message'));
      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.mainSearchListFailure$).toBeObservable(expected);
      expect(TestBed.get(MessageService).handleError).toHaveBeenCalledWith(
        new Error('error message'),
        'resources.searchList',
      );
    });
  });
});
