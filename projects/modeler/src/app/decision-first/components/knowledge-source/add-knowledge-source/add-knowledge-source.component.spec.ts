import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, NbDialogRefMock } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import { AddKnowledgeSource } from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddKnowledgeSourceComponent } from './add-knowledge-source.component';

describe('AddKnowledgeSourceComponent', () => {
  let component: AddKnowledgeSourceComponent;
  let fixture: ComponentFixture<AddKnowledgeSourceComponent>;
  let modelerStore: Store<IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddKnowledgeSourceComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        NoopAnimationsModule,
        DmsThemeModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [NbDialogService, { provide: NbDialogRef, useClass: NbDialogRefMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(AddKnowledgeSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking on Add Knowledge Source dispatches the Add Diagram Event', () => {
    const newKnowledgeSource = {
      name: 'test name',
      description: 'test description',
      url: 'http://example.com',
      type: 'test type',
    };
    component.formGroup.setValue(newKnowledgeSource);
    const expectedAction = new AddKnowledgeSource({ ...newKnowledgeSource });
    triggerMouseClick(fixture, 'button');
    expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({ ...expectedAction });
  });

  it('clicking on Add Knowledge Source does nothing if the form is invalid', () => {
    const newKnowledgeSource = {
      name: '',
      description: 'test description',
      url: 'http://example.com',
      type: 'test type',
    };
    component.formGroup.setValue(newKnowledgeSource);
    triggerMouseClick(fixture, 'button');
    expect(dispatchModelerStore).not.toHaveBeenCalled();
  });
});
