import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { DmsThemeModule } from '../../../../theme';
import { Decision } from '../../../models/decision.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditGraphableComponent } from './edit-graphable.component';

describe('EditGraphableComponent', () => {
  let component: EditGraphableComponent;
  let fixture: ComponentFixture<EditGraphableComponent>;
  let dispatchModelerStore: jasmine.Spy;

  const decision = new Decision();
  decision.id = 'decision1000';
  decision.name = 'name';
  decision.description = 'description';
  decision._links = { self: { href: 'http://self' } } as any;
  decision.tags = [];

  const knowledgeSource = new KnowledgeSource();
  knowledgeSource.id = 'knowledgeSource1000';
  knowledgeSource.name = 'name';
  knowledgeSource.description = 'description';
  knowledgeSource._links = { self: { href: 'http://self' } } as any;
  knowledgeSource.tags = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditGraphableComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'dfm-diagram-implementation-components', inputs: ['implementationComponents'] }),
      ],
      imports: [
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');
    fixture = TestBed.createComponent(EditGraphableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches an UpdateDecision on value changes if the form is valid', fakeAsync(() => {
    component.graphable = decision;
    component.graphableForm.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateDecision({
        decision: {
          id: decision.id,
          name: 'New Name',
          description: decision.description,
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

  it('dispatches an UpdateKnowledgeSource on value changes if the form is valid', fakeAsync(() => {
    component.graphable = knowledgeSource;
    component.graphableForm.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateKnowledgeSource({
        knowledgeSource: {
          _links: knowledgeSource._links,
          description: knowledgeSource.description,
          id: knowledgeSource.id,
          name: 'New Name',
        },
        objectTagsUpdate: {
          tags: knowledgeSource.tags,
          name: 'New Name',
          description: knowledgeSource.description,
        }  
      }),
    );
  }));

  it('does nothing on changes if the form is invalid', fakeAsync(() => {
    component.graphable = decision;
    component.graphableForm.get('name').setValue('');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.count()).toEqual(0);
  }));

  describe('read only mode', () => {
    it('should enable form control', () => {
      component.isReadOnly = false;
      expect(component.graphableForm.enabled).toBeTruthy();
    });

    it('should disable form control', () => {
      component.isReadOnly = true;
      expect(component.graphableForm.disabled).toBeTruthy();
    });
  });
});
