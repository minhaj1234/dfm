import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { NgDragDropModule } from 'ng-drag-drop';
import { Config } from '../../../../config';
import { DmsThemeModule } from '../../../../theme';
import { Decision } from '../../../models/decision.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditDecisionComponent } from './edit-decision.component';

describe('EditDecisionComponent', () => {
  let component: EditDecisionComponent;
  let fixture: ComponentFixture<EditDecisionComponent>;
  let dispatchModelerStore: jasmine.Spy;
  const decision = new Decision();
  decision.id = 'decisionId';
  decision.name = 'Decision Name';
  decision.description = 'Any interesting description';
  decision.type = 'a type';
  decision.statusLevel = 'IN_PROCESS';
  decision.url = 'http://example.com';
  decision._links = { self: { href: 'http://self' } } as any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditDecisionComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
      ],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
        NgDragDropModule.forRoot(),
      ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(EditDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches an UpdateDecision on value changes if the form is valid', fakeAsync(() => {
    component.editObject = decision;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateDecision({
        decision: {
          id: decision.id,
          name: 'New Name',
          description: decision.description,
          type: decision.type,
          statusLevel: decision.statusLevel,
          url: decision.url,
          _links: decision._links,
        },
        objectTagsUpdate: {
          tags: decision.tags,
          name: 'New Name',
          description: decision.description,
        }
      }),
    );
  }));

  it('does nothing on changes if the form is invalid', fakeAsync(() => {
    component.formGroup.get('name').setValue('');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.count()).toEqual(0);
  }));

  describe('read only mode', () => {
    it('should enable form control', () => {
      component.isReadOnly = false;
      expect(component.formGroup.enabled).toBeTruthy();
    });

    it('should disable form control', () => {
      component.isReadOnly = true;
      expect(component.formGroup.disabled).toBeTruthy();
    });
  });
});
