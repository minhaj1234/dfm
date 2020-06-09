import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { JumpMenuItems } from 'core/models';
import { MockComponent } from 'core/testing'
import { NgDragDropModule } from 'ng-drag-drop';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { DmsThemeModule } from '../../../theme';
import * as fromModelerStore from '../../store';
import { TestStoreModule } from '../../testing/test-store-module.spec';
import { EditDecisionContainerComponent } from './edit-decision-container.component';

describe('EditDecisionContainerComponent', () => {
  let component: EditDecisionContainerComponent;
  let fixture: ComponentFixture<EditDecisionContainerComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditDecisionContainerComponent,
        MockComponent({ selector: 'dfm-jump-menu', inputs: ['object', 'anchors'] }),
        MockComponent({ selector: 'dfm-edit-decision', inputs: ['editObject', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-graphable-generated-requirements-diagram', inputs: ['graphable'] }),
        MockComponent({ selector: 'dfm-question-and-answers', inputs: ['decision', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-decision-implementation-table-container', inputs: ['isReadOnly', 'decision', 'tableContainer'] }),
        MockComponent({ selector: 'dfm-relation-objects-display', inputs:
          ['caption', 'addAction', 'removeAction', 'to', 'acceptsType', 'relationObjectsKey', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-graphable-primary-diagram', inputs: ['graphable', 'isReadOnly'] }),
        MockComponent({ selector: 'dfm-comments-container', inputs: ['addAction', 'removeAction', 'object', 'comments', 'isReadOnly', 'authenticatedUser'] }),
      ],
      imports: [
        FormsModule,
        NbThemeModule.forRoot(),
        NgDragDropModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        DmsThemeModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(EditDecisionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('expandDecisionTable', () => {
    it('should invert isExpandedDecisionTable', () => {
      component.decisionTableExpanded = false;

      component.expandDecisionTable();

      expect(component.decisionTableExpanded).toBeTruthy();
    });

    it('should dispatch UpdateJumpMenuSelectedItemInTab', fakeAsync(() => {
      component.decisionId = '12345';
      
      component.expandDecisionTable();

      tick();
      expect(store.dispatch).toHaveBeenCalledWith(
        new fromModelerStore.UpdateJumpMenuSelectedItemInTab({id: '12345', jumpMenuSelectedItem: JumpMenuItems.Implementation})
      );
    }));
  });
});
