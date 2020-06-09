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
import { AddProcessComponent } from './add-process.component';

describe('AddProcessComponent', () => {
  let component: AddProcessComponent;
  let fixture: ComponentFixture<AddProcessComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddProcessComponent,
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

    fixture = TestBed.createComponent(AddProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new process', () => {
    const process = {
      name: 'test name',
      description: 'test description',
      url: 'test url'
    };

    component.formGroup.setValue(process);

    triggerMouseClick(fixture, '.add-process');

    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddProcess(process));
  });

  it('should do not create process if form invalid', () => {
    const process = {
      name: null,
      description: 'test description',
      url: 'test url'
    };

    component.formGroup.setValue(process);

    triggerMouseClick(fixture, '.add-process');

    expect(modelerStore.dispatch).not.toHaveBeenCalled();
  });
});
