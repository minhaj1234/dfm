import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, NbDialogRefMock } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { DmsThemeModule } from '../../../../theme';
import * as fromModelerStore from '../../../store';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { AddSystemComponent } from './add-system.component';

describe('AddSystemComponent', () => {
  let component: AddSystemComponent;
  let fixture: ComponentFixture<AddSystemComponent>;
  let modelerStore: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddSystemComponent,
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

    fixture = TestBed.createComponent(AddSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new system', () => {
    const system = {
      name: 'test name',
      description: 'test description',
      url: 'test url'
    };

    component.formGroup.setValue(system);

    triggerMouseClick(fixture, '.add-system');

    expect(modelerStore.dispatch).toHaveBeenCalledWith(new fromModelerStore.AddSystem(system));
  });

  it('should do not create system if form invalid', () => {
    const event = {
      name: null,
      description: 'test description',
      url: 'test url'
    };

    component.formGroup.setValue(event);

    triggerMouseClick(fixture, '.add-system');

    expect(modelerStore.dispatch).not.toHaveBeenCalled();
  });
});
