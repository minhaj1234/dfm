import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { AngularHalModule, ExternalService } from 'angular4-hal';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { ImplementationComponentsIconsService } from 'core/objects/implementation-component/services';
import * as fromStore from 'core/objects/implementation-component/store';
import { rootActions } from 'core/root-store';
import { MessageService } from 'core/services';
import { FakeExternalService, TestStoreModule  } from 'core/testing'
import { FakeMessageService } from 'core/testing';
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

describe('ImplementationComponentsIcons Effects', () => {
  let actions$: TestActions;
  let service: ImplementationComponentsIconsService;
  let effects: fromStore.ImplementationComponentsIconsEffects;
  let messageService: MessageService;
  let store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        AngularHalModule,
        TestStoreModule,
        StoreModule.forFeature('DecisionFirst', fromStore.reducers),
      ],
      providers: [
        ImplementationComponentsIconsService,
        fromStore.ImplementationComponentsIconsEffects,
        { provide: Actions, useFactory: getActions },
        { provide: ExternalService, useValue: new FakeExternalService() },
        { provide: MessageService, useValue: new FakeMessageService() },
      ],
    });

    actions$ = TestBed.get(Actions);
    service = TestBed.get(ImplementationComponentsIconsService);
    effects = TestBed.get(fromStore.ImplementationComponentsIconsEffects);
    messageService = TestBed.get(MessageService);
    store = TestBed.get(Store);
    store.dispatch(new rootActions.ValidationSuccess({ userId: 'userId' } as any));

    spyOn(service, 'getImplementationComponentIcons').and.returnValue(of([{ id: '12345' } as ImplementationComponentIcon]));
    spyOn(service, 'getImplementationComponentIcon').and.returnValue(of({ id: '12345' } as ImplementationComponentIcon));
    spyOn(service, 'uploadImplementationComponentIcon').and.returnValue(of({}));

    spyOn(messageService, 'handleError');
    spyOn(messageService, 'showSuccess');
  });

  describe('loadImplementationComponentsIcons$', () => {
    it('should dispatch LoadImplementationComponentsIconsSuccess', () => {
      const action = new fromStore.LoadImplementationComponentsIcons();
      const completion = new fromStore.LoadImplementationComponentsIconsSuccess([{ id: '12345' } as ImplementationComponentIcon]);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponentsIcons$).toBeObservable(expected);
    });

    it('should dispatch GenericImplementationComponentsIconsFailure if the service throws an error', () => {
      (service.getImplementationComponentIcons as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromStore.LoadImplementationComponentsIcons();
      const completion = new fromStore.GenericImplementationComponentsIconsFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponentsIcons$).toBeObservable(expected);
    });
  });

  describe('loadImplementationComponentsIcon$', () => {
    it('should dispatch LoadImplementationComponentsIconSuccess', () => {
      const action = new fromStore.LoadImplementationComponentsIcon('12345');
      const completion = new fromStore.LoadImplementationComponentsIconSuccess({ id: '12345' } as ImplementationComponentIcon);
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponentsIcon$).toBeObservable(expected);
    });

    it('should dispatch ImplementationComponentsIconsFailure if the service throws an error', () => {
      (service.getImplementationComponentIcon as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromStore.LoadImplementationComponentsIcon('12345');
      const completion = new fromStore.ImplementationComponentsIconsFailure({
        id: '12345',
        error: new Error('error message'),
      });
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.loadImplementationComponentsIcon$).toBeObservable(expected);
    });
  });

  describe('uploadImplementationComponentsIcons$', () => {
    it('should dispatch UploadImplementationComponentsIconSuccess', () => {
      const action = new fromStore.UploadImplementationComponentsIcon({} as any);
      const completion = new fromStore.UploadImplementationComponentsIconSuccess();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.uploadImplementationComponentsIcons$).toBeObservable(expected);
    });

    it('should dispatch GenericImplementationComponentsIconsFailure if the service throws an error', () => {
      (service.uploadImplementationComponentIcon as jasmine.Spy).and.returnValue(throwError(new Error('error message')));
      const action = new fromStore.UploadImplementationComponentsIcon({} as any);
      const completion = new fromStore.GenericImplementationComponentsIconsFailure(new Error('error message'));
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.uploadImplementationComponentsIcons$).toBeObservable(expected);
    });
  });

  describe('genericImplementationComponentsIconsFailure$', () => {
    it('should call messageService.handleError', () => {
      const action = new fromStore.GenericImplementationComponentsIconsFailure(new Error());
      const completion = new fromStore.GenericImplementationComponentsIconsFailure(new Error());
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericImplementationComponentsIconsFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalled();
    });
  });

  describe('genericImplementationComponentsIconsFailure$', () => {
    it('should call messageService.handleError', () => {
      const action = new fromStore.GenericImplementationComponentsIconsFailure(new Error());
      const completion = new fromStore.GenericImplementationComponentsIconsFailure(new Error());
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.genericImplementationComponentsIconsFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalled();
    });
  });

  describe('implementationComponentsIconsFailure$', () => {
    it('should call messageService.handleError', () => {
      const action = new fromStore.ImplementationComponentsIconsFailure({id: '12345', error: new Error()});
      const completion = new fromStore.ImplementationComponentsIconsFailure({id: '12345', error: new Error()});
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.implementationComponentsIconsFailure$).toBeObservable(expected);
      expect(messageService.handleError).toHaveBeenCalled();
    });
  });

  describe('uploadImplementationComponentsIconSuccess$', () => {
    it('should call messageService.showSuccess', () => {
      const action = new fromStore.UploadImplementationComponentsIconSuccess();
      const completion = new fromStore.UploadImplementationComponentsIconSuccess();
      const expected = cold('-b', { b: completion });

      actions$.stream = hot('-a', { a: action });

      expect(effects.uploadImplementationComponentsIconSuccess$).toBeObservable(expected);
      expect(messageService.showSuccess).toHaveBeenCalled();
    });
  });
});
