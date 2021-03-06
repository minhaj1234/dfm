import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Config } from '../../../../config';
import { InputData } from '../../../models/inputData.model';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { EditInputDataComponent } from './edit-input-data.component';

describe('EditInputDataComponent', () => {
  let component: EditInputDataComponent;
  let fixture: ComponentFixture<EditInputDataComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  const inputData = new InputData();
  inputData.id = 'inputData1';
  inputData.name = 'test-name';
  inputData.description = 'test-description';
  inputData.type = 'STRUCTURED';
  inputData.url = 'https://inputData1.com';
  inputData.complexity = 'inputData complexity';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditInputDataComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
        MockComponent({ selector: 'core-object-tags', inputs: ['addTabAction', 'tags'] }),
        MockComponent({ selector: 'core-input-url', inputs: ['formControlName'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInputDataComponent);
    component = fixture.componentInstance;

    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validated form', () => {
    component.editObject = inputData;
    component.formGroup.get('name').setValue('');
    expect(component.formGroup.invalid).toBeTruthy();
  });

  it('dispatches an UpdateInputData on value changes if the form is valid', fakeAsync(() => {
    component.editObject = inputData;
    component.formGroup.get('name').setValue('New Name');
    tick(Config.debounceTime);
    expect(dispatchModelerStore.calls.first().args[0]).toEqual(
      new fromModelerStore.UpdateInputData({
        inputData: {
          id: inputData.id,
          name: 'New Name',
          description: inputData.description,
          type: inputData.type,
          url: inputData.url,
          complexity: inputData.complexity,
          _links: inputData._links,
        },
        objectTagsUpdate: {
          tags: inputData.tags,
          name: 'New Name',
          description: inputData.description,
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
