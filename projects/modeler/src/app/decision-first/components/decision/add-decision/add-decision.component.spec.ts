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
import * as fromModelerStore from '../../../store';
import { IDecisionFirstState } from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddDecisionComponent } from './add-decision.component';

describe('AddDecisionComponent', () => {
  let component: AddDecisionComponent;
  let fixture: ComponentFixture<AddDecisionComponent>;
  let modelerStore: Store<IDecisionFirstState>;
  let dispatchModelerStore: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddDecisionComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        NoopAnimationsModule,
        DmsThemeModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        TestStoreModule,
      ],
      providers: [NbDialogService, { provide: NbDialogRef, useClass: NbDialogRefMock }],
    }).compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    dispatchModelerStore = spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(AddDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking on Add Decision dispatches the Add Decision Event', () => {
    const newDecision = {
      name: 'test name',
      description: 'test description',
      type: 'TACTICAL',
      statusLevel: 'IN_PROCESS',
      url: 'http://example.com',
      question: 'why?',
    };
    component.formGroup.setValue(newDecision);
    const expectedAction = new fromModelerStore.AddDecision({ ...newDecision });
    triggerMouseClick(fixture, 'button');
    expect({ ...dispatchModelerStore.calls.first().args[0] }).toEqual({ ...expectedAction });
  });

  it('clicking on Add Decision does nothing if the form is invalid', () => {
    const newDecision = {
      name: '',
      description: 'test description',
      type: 'TACTICAL',
      statusLevel: 'IN_PROCESS',
      url: 'http://example.com',
      question: 'why?',
    };
    component.formGroup.setValue(newDecision);
    triggerMouseClick(fixture, 'button');
    expect(dispatchModelerStore).not.toHaveBeenCalled();
  });
});
