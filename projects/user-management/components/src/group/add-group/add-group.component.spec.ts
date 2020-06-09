import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbCardModule, NbDialogModule, NbDialogRef, NbThemeModule } from '@nebular/theme';
import { Action, Store, StoreModule } from '@ngrx/store';
import { MockComponent, NbDialogRefMock } from 'core/testing';
import { triggerMouseClick } from 'core/testing';
import { Group } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { AddGroupComponent } from './add-group.component';

class FakeAddGroup implements Action {
  readonly type = 'addTab';
  constructor(payload: {
    group: Partial<Group>;
    accountId: string;
  }) {}
}

describe('AddGroupComponent', () => {
  let component: AddGroupComponent;
  let fixture: ComponentFixture<AddGroupComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddGroupComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength'] }, true),
      ],
      imports: [
        ReactiveFormsModule,
        StoreModule.forRoot([]),
        NoopAnimationsModule,
        NbThemeModule.forRoot(),
        FormsModule,
        NbDialogModule.forRoot({autoFocus: false}),  
        NbCardModule,
      ],
      providers: [
        { provide: NbDialogRef, useClass: NbDialogRefMock }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    component.customerId = '12345';
    component.addAction = FakeAddGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Click add group button', () => {
    it('should dispatch addGroupAction', () => {
      component.formGroup.setValue(getGroupFormValue());
      
      triggerMouseClick(fixture, '.btn');

      expect(store.dispatch).toHaveBeenCalledWith(new FakeAddGroup(getGroupFormValue()));
    });

    it('should not dispatch action to add group if form is invalid', () => {
      component.formGroup.setValue(getGroupFormValue(''));
      
      triggerMouseClick(fixture, '.btn');

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});

function getGroupFormValue(name = 'name') {
  return {
    group: {
      name,
    },
    accountId: '12345',
  };
}
