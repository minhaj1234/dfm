import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { VersionInformation } from 'core/models';
import { rootActions, rootEffects, rootReducers, VersionInformationService } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeMessageService } from 'core/testing';
import { FakeExternalService  } from 'core/testing'
import { TestStoreModule } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError, EMPTY, Observable } from 'rxjs';

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

describe('Version Information Effects', () => {
  let actions$: TestActions;
  let service: VersionInformationService;
  let effects: rootEffects.VersionInformationEffects;
  let store: Store<rootReducers.IState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AngularHalModule, TestStoreModule],
      providers: [
        VersionInformationService,
        rootEffects.VersionInformationEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(VersionInformationService);
    effects = TestBed.get(rootEffects.VersionInformationEffects);
    store = TestBed.get(Store);

    
    spyOn(service, 'loadVersionInformation').and.returnValue(of({information: 'information' } as VersionInformation));
    spyOn(service, 'updateVersionInformation').and.returnValue(of({} as any));
  });

  describe('loadVersionInformation$', () => {
    it('should dispatch LoadVersionInformationSuccess', () => {
      const action = new rootActions.LoadVersionInformation();
      const completion = new rootActions.LoadVersionInformationSuccess({information: 'information' } as VersionInformation);
      const expected = cold('-(b)', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadVersionInformation$).toBeObservable(expected);
    });

    it('should dispatch GenericDecisionFailure if the service throws an error', () => {
      (service.loadVersionInformation as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new rootActions.LoadVersionInformation();
      const completion = new rootActions.VersionInformationFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadVersionInformation$).toBeObservable(expected);
    });
  });

  describe('updateVersionInformation$', () => {
    it('should dispatch NoOpAction', () => {
      const action = new rootActions.UpdateVersionInformation({} as VersionInformation);
      const completion = new rootActions.NoOpAction();
      const expected = cold('-(b)', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateVersionInformation$).toBeObservable(expected);
    });

    it('should dispatch GenericDecisionFailure if the service throws an error', () => {
      (service.updateVersionInformation as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new rootActions.UpdateVersionInformation({} as VersionInformation);
      const completion = new rootActions.VersionInformationFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.updateVersionInformation$).toBeObservable(expected);
    });
  });
});
