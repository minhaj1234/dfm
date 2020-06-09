import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { Process } from '../../../models/process.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditProcessComponent } from './edit-process.component';

describe('EditProcessComponent', () => {
  let component: EditProcessComponent;
  let fixture: ComponentFixture<EditProcessComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const process = new Process();
  process.id = 'process1';
  process.name = 'test-name';
  process.description = 'test-description';
  process.url = 'https://process-test.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditProcessComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProcessComponent);
    component = fixture.componentInstance;
    component.editObject = process;

    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validated form', () => {
    component.formGroup.get('name').setValue('');
    expect(component.formGroup.invalid).toBeTruthy();
  });

  it('dispatches an UpdateProcess on value changes if the form is valid', fakeAsync(() => {
    component.editObject = process;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateProcess({
        process: {
          id: process.id,
          name: 'New Name',
          description: process.description,
          url: process.url,
          _links: process._links,
        },
        objectTagsUpdate: {
          tags: process.tags,
          name: 'New Name',
          description: process.description,
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
