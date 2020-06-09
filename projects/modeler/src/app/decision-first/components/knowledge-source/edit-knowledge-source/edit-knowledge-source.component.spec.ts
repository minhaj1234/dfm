import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { DmsThemeModule } from '../../../../theme';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditKnowledgeSourceComponent } from './edit-knowledge-source.component';

describe('EditKnowledgeSourceComponent', () => {
  let component: EditKnowledgeSourceComponent;
  let fixture: ComponentFixture<EditKnowledgeSourceComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const knowledgeSource = new KnowledgeSource();
  knowledgeSource.name = 'Decision Name';
  knowledgeSource.description = 'Any interesting description';
  knowledgeSource.url = 'http://example.com';
  knowledgeSource.type = 'a type';
  knowledgeSource.complexity = 'simple';
  knowledgeSource._links = { self: { href: 'http://self' } } as any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditKnowledgeSourceComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
      ],
      imports: [
        NoopAnimationsModule,
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditKnowledgeSourceComponent);
    component = fixture.componentInstance;

    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dispatches an UpdateKnowledgeSource on value changes if the form is valid', fakeAsync(() => {
    component.editObject = knowledgeSource;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateKnowledgeSource({
        knowledgeSource: {
          id: knowledgeSource.id,
          name: 'New Name',
          description: knowledgeSource.description,
          url: knowledgeSource.url,
          complexity: knowledgeSource.complexity,
          type: knowledgeSource.type,
          _links: knowledgeSource._links,
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
