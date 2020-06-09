import { APP_BASE_HREF } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { blankPages } from 'core/models';
import { DefaultJumpMenuSelectedItem, ObjectTabType, TechnicalTabType } from 'core/models';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { User } from 'user-management/models';
import { DmsThemeModule } from '../../../theme';
import { Decision } from '../../models/decision.model';
import { Diagram } from '../../models/diagram.model';
import { KnowledgeSource } from '../../models/knowledgeSource.model';
import * as fromStore from '../../store';
import { AddTab, LoadDiagramsListSuccess } from '../../store';
import { IDecisionFirstState } from '../../store/reducers';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { TabsContainerComponent } from './tabs-container.component';

describe('TabsContainerComponent', () => {
  let component: TabsContainerComponent;
  let fixture: ComponentFixture<TabsContainerComponent>;
  let store: Store<IDecisionFirstState>;
  let navigate: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TabsContainerComponent,
        MockComponent({ selector: 'dfm-home-container' }),
        MockComponent({ selector: 'dfm-admin-container' }),
        MockComponent({ selector: 'dfm-search-container' }),
        MockComponent({ selector: 'dfm-view-diagram-container', inputs: ['diagramId'] }),
        MockComponent({ selector: 'dfm-edit-decision-container', inputs: ['decisionId'] }),
        MockComponent({ selector: 'dfm-edit-knowledge-source-container', inputs: ['knowledgeSourceId'] }),
        MockComponent({ selector: 'dfm-edit-organization-container', inputs: ['organizationId'] }),
        MockComponent({ selector: 'dfm-edit-input-data-container', inputs: ['inputDataId'] }),
        MockComponent({ selector: 'dfm-edit-business-objective-container', inputs: ['businessObjectiveId'] }),
        MockComponent({ selector: 'dfm-edit-process-container', inputs: ['processId'] }),
        MockComponent({ selector: 'dfm-edit-event-container', inputs: ['eventId'] }),
        MockComponent({ selector: 'dfm-edit-system-container', inputs: ['systemId'] }),
        MockComponent({ selector: 'dfm-edit-implementation-component-container', inputs: ['implementationComponentId'] }),
        MockComponent({ selector: 'dfm-tag-page-container', inputs: ['tagId'] }),
        MockComponent({selector: 'user-management-edit-user-container',inputs: ['userId','options']}),
        MockComponent({selector: 'user-management-edit-group-container', inputs: ['groupId','options'] }),
        MockComponent({selector: 'dfm-print-container', inputs: ['objectId', 'objectType', 'customerFooter'] }),
        MockComponent({selector: 'dfm-print-tab-container', inputs: ['tab'] }),
      ],
      imports: [
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        NbThemeModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        DmsThemeModule,
        TestStoreModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    }).compileComponents();

    store = TestBed.get(Store);
    const diagram1 = new Diagram();
    diagram1.name = 'Diagram 1';
    diagram1.id = 'diagram1';
    const diagram2 = new Diagram();
    diagram2.name = 'Diagram 2';
    diagram2.id = 'diagram2';
    const decision1 = new Decision();
    decision1.name = 'Decision 1';
    decision1.id = 'decision1';
    const knowledgeSource1 = new KnowledgeSource();
    knowledgeSource1.name = 'Knowledge Source 1';
    knowledgeSource1.id = 'knowledgeSource1';
    store.dispatch(new AddTab({ type: TechnicalTabType.Search }));
    store.dispatch(new AddTab({ id: 'diagram1', type: ObjectTabType.Diagram }));
    store.dispatch(new AddTab({ id: 'diagram2', type: ObjectTabType.Diagram }));
    store.dispatch(new AddTab({ id: 'decision1', type: ObjectTabType.Decision }));
    store.dispatch(new AddTab({ id: 'knowledgeSource1', type: ObjectTabType.KnowledgeSource }));
    store.dispatch(
      new LoadDiagramsListSuccess({
        pagination: blankPages,
        results: [diagram1],
      }),
    );

    const router = TestBed.get(Router);
    navigate = spyOn(router, 'navigate');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updating the query params', () => {
    it('updates the queryParams to represent the current tab', async(() => {
      navigate.calls.reset();
      store.dispatch(new fromStore.AddTab({ id: 'diagram1', type: ObjectTabType.Diagram }));
      const call = navigate.calls.argsFor(0);
      const [route, { queryParams }] = call;
      expect(route).toEqual(['']);
      expect(queryParams).toEqual({ id: 'diagram1', type: ObjectTabType.Diagram });
    }));

    it('hide id for technical tab', async(() => {
      navigate.calls.reset();
      store.dispatch(new fromStore.AddTab({ type: TechnicalTabType.Search }));
      const call = navigate.calls.argsFor(0);
      const [route, { queryParams }] = call;
      expect(route).toEqual(['']);
      expect(queryParams).toEqual({ type: TechnicalTabType.Search });
    }));

    it('clears the query parameters if there is no current tab loaded', async(() => {
      store.dispatch(new fromStore.RemoveTab(TechnicalTabType.Search));
      store.dispatch(new fromStore.RemoveTab('diagram1'));
      store.dispatch(new fromStore.RemoveTab('diagram2'));
      store.dispatch(new fromStore.RemoveTab('decision1'));
      store.dispatch(new fromStore.RemoveTab('knowledgeSource1'));
      const call = navigate.calls.mostRecent().args;
      const [route, { queryParams }] = call;
      expect(route).toEqual(['']);
      expect(queryParams).toBeUndefined();
    }));
  });

  describe('Loading for the first time, checking query params', () => {
    it('does nothing if there is not a type or id in the query params', () => {
      spyOn(store, 'dispatch');
      component.checkIfTabNeedsToBeLoadedFirstTime();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('loads the tab if needed', async(() => {
      // Straight copy from Redux tools in chrome - not worth sorting the keys.
      /* tslint:disable:object-literal-sort-keys */
      store.dispatch({
        type: '@ngrx/router-store/navigation',
        payload: {
          routerState: {
            params: {},
            queryParams: {
              type: 'Diagram',
              id: 'diagram1',
            },
            url: '/decision-first?type=Diagram&id=diagram1',
          },
          event: {
            id: 2,
            url: '/?type=Diagram&id=diagram1',
            urlAfterRedirects: '/decision-first?type=Diagram&id=diagram1',
            state: {
              params: {},
              queryParams: {
                type: 'Diagram',
                id: 'diagram1',
              },
              url: '/decision-first?type=Diagram&id=diagram1',
            },
          },
        },
      });
      /* tslint:enable:object-literal-sort-keys */

      spyOn(store, 'dispatch');
      component.checkIfTabNeedsToBeLoadedFirstTime();
      expect(store.dispatch).toHaveBeenCalledWith(new AddTab({ id: 'diagram1', type: ObjectTabType.Diagram }));
    }));
  });

  describe('tab names', () => {
    it('uses a blank name if the name has not been loaded yet', () => {
      expect(
        fixture.debugElement.query(By.css('li[data-action="focus-diagram2"]')).query(By.css('span')).nativeElement
          .textContent,
      ).toEqual('');
    });

    it('use firstname of user', () => {
      const user = getTestUser();
      store.dispatch(new fromStore.LoadUserSuccess(user));
      const expected = user.firstName;

      store.dispatch(new AddTab({ id: user.id, type: ObjectTabType.User }));
      fixture.detectChanges();
      
      expect(
        fixture.debugElement.query(By.css('li[data-action="focus-user1"]')).query(By.css('span')).nativeElement
          .textContent,
      ).toEqual(expected);
    });

    it('use name of object', () => {
      const decision = getTestDecision()
      store.dispatch(new fromStore.LoadDecisionSuccess(decision));
      const expected = decision.name;

      store.dispatch(new AddTab({ id: decision.id, type: ObjectTabType.Decision }));
      fixture.detectChanges();
      
      expect(
        fixture.debugElement.query(By.css('li[data-action="focus-decision1"]')).query(By.css('span')).nativeElement
          .textContent,
      ).toEqual(expected);
    });
  });

  describe('closeTab', () => {
    it('dispatches a close event when the close-button is clicked', () => {
      spyOn(store, 'dispatch');
      fixture.debugElement
        .query(By.css('i[data-action="close-diagram2"]'))
        .triggerEventHandler('click', { stopPropagation() {} });
      expect(store.dispatch).toHaveBeenCalledWith(new fromStore.RemoveTab('diagram2'));
    });
  });

  describe('focusTab', () => {
    it('dispatches a focus event when the tab is clicked', () => {
      spyOn(store, 'dispatch');
      fixture.debugElement.query(By.css('li[data-action="focus-decision1')).triggerEventHandler('click', null);
      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.SetSelectedTab({ id: 'decision1', type: ObjectTabType.Decision, jumpMenuSelectedItem: DefaultJumpMenuSelectedItem }),
      );
    });
  });

  function getTestUser(): User {
    const user = new User();
    user.firstName = 'user firstname';
    user.id = 'user1'

    return user;
  }

  function getTestDecision() : Decision {
    const decision = new Decision();
    decision.id = 'decision1';
    decision.name = 'decision name'

    return decision;
  }
});
