import { TestBed } from '@angular/core/testing';
import { NbSidebarService } from '@nebular/theme';
import { Actions } from '@ngrx/effects';
import { TestStoreModule } from 'core/testing';
import { cold, hot } from 'jasmine-marbles';
import { EMPTY, Observable } from 'rxjs';
import * as fromActions from '../actions';
import * as fromEffects from './sidebar.effect';

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

describe('Sidebar Effects', () => {
  let actions$: TestActions;
  let effects: fromEffects.SidebarEffects;
  let sidebarService: NbSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestStoreModule,
      ],
      providers: [
        NbSidebarService,
        fromEffects.SidebarEffects,
        { provide: Actions, useFactory: getActions },
      ],
    });

    sidebarService = TestBed.get(NbSidebarService);
    actions$ = TestBed.get(Actions);
    effects = TestBed.get(fromEffects.SidebarEffects);

    spyOn(sidebarService, 'expand');
    spyOn(sidebarService, 'collapse');
  });

  describe('expandSidebar$', () => {
    it('should call expand function in sidebar service', () => {
      const action = new fromActions.ExpandSidebar();

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: action });

      expect(effects.expandSidebar$).toBeObservable(expected);
      expect(sidebarService.expand).toHaveBeenCalled();
    });
  });

  describe('collapseSidebar$', () => {
    it('should dispatch SetInitialStateSidebar action and call collapse function', () => {
      const action = new fromActions.CollapseSidebar();
      const completion = new fromActions.SetInitialStateSidebar();

      actions$.stream = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.collapseSidebar$).toBeObservable(expected);
      expect(sidebarService.collapse).toHaveBeenCalled();
    });
  });
});
