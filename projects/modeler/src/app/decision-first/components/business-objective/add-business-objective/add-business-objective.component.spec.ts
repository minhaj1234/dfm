import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { triggerMouseClick, MockComponent, NbDialogRefMock } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddBusinessObjectiveComponent } from './add-business-objective.component';

describe('AddBusinessObjectiveComponent', () => {
  let component: AddBusinessObjectiveComponent;
  let fixture: ComponentFixture<AddBusinessObjectiveComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddBusinessObjectiveComponent,
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

    fixture = TestBed.createComponent(AddBusinessObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new business objective', () => {
    const businessObjective = {
      name: 'test name',
      description: 'test description',
      url: 'test url'
    };

    component.formGroup.setValue(businessObjective);

    triggerMouseClick(fixture, '.add-business-objective');

    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddBusinessObjective(businessObjective));
  });

  it('should do not create business objective if form invalid', () => {
    const businessObjective = {
      name: null,
      description: 'test description',
      url: 'test url'
    };

    component.formGroup.setValue(businessObjective);

    triggerMouseClick(fixture, '.add-business-objective');

    expect(modelerStore.dispatch).not.toHaveBeenCalled();
  });
});
