import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, NbDialogRefMock } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddInputDataComponent } from './add-input-data.component';

describe('AddInputDataComponent', () => {
  let component: AddInputDataComponent;
  let fixture: ComponentFixture<AddInputDataComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddInputDataComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        DmsThemeModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        TestStoreModule,
      ],
      providers: [NbDialogService, { provide: NbDialogRef, useClass: NbDialogRefMock }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    modelerStore = TestBed.get(Store);
    spyOn(modelerStore, 'dispatch');

    fixture = TestBed.createComponent(AddInputDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new input data', () => {
    const inputData = {
      name: 'test name',
      description: 'test description',
      type: 'SEMI_STRUCTURED',
      url: 'test url'
    };

    component.formGroup.setValue(inputData);

    triggerMouseClick(fixture, '.add-input-data');

    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddInputData(inputData));
  });

  it('should do not create input data if form invalid', () => {
    const inputData = {
      name: null,
      description: 'test description',
      type: 'SEMI_STRUCTURED',
      url: 'test url'
    };

    component.formGroup.setValue(inputData);

    triggerMouseClick(fixture, '.add-input-data');

    expect(modelerStore.dispatch).not.toHaveBeenCalled();
  });
});
