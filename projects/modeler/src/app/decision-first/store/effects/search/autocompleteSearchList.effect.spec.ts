import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { MessageService } from 'core/services';
import { FakeExternalService  } from 'core/testing'
import { FakeMessageService } from 'core/testing'
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';
import { RepositoryService } from '../../../services/repository.service';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import * as fromAutocompleteSearchListActions from '../../actions/search/autocompleteSearchList.actions';
import { IDecisionFirstState } from '../../reducers';
import * as fromAutocompleteSearchListEffects from './autocompleteSearchList.effect';

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

describe('Autocomplete Search List Effects', () => {
  let actions$: TestActions;
  let service: RepositoryService;
  let effects: fromAutocompleteSearchListEffects.AutocompleteSearchListEffects;
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
        RepositoryService,
        fromAutocompleteSearchListEffects.AutocompleteSearchListEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(RepositoryService);
    effects = TestBed.get(fromAutocompleteSearchListEffects.AutocompleteSearchListEffects);
    store = TestBed.get(Store);
    messageService = TestBed.get(MessageService);

    spyOn(service, 'getSomeMinimalWithSearch').and.returnValue(of({} as any));
    spyOn(messageService, 'handleError');
  });

  describe('updateSearchForAutocompleteSearchList$', () => {
    it('should dispatch LoadAutocompleteSearchListSuccess', () => {
      const action = new fromAutocompleteSearchListActions.UpdateSearchForAutocompleteSearchList({ searchTerm: '' });
      const completion = new fromAutocompleteSearchListActions.LoadAutocompleteSearchListSuccess({} as any);

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateAutocompleteSearchList$).toBeObservable(expected);
    });

    it('should dispatch AutocompleteSearchListFailure if the service throws an error', () => {
      (service.getSomeMinimalWithSearch as jasmine.Spy).and.returnValue(throwError({ message: 'error message' }));
      const action = new fromAutocompleteSearchListActions.UpdateSearchForAutocompleteSearchList({ searchTerm: '' });
      const completion = new fromAutocompleteSearchListActions.AutocompleteSearchListFailure(new Error('error message'));

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateAutocompleteSearchList$).toBeObservable(expected);
    });
  });
});
