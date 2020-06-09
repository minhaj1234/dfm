import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbCardModule, NbDialogModule, NbDialogRef, NbThemeModule } from '@nebular/theme';
import { Action, Store, StoreModule } from '@ngrx/store';
import { triggerMouseClick, MockComponent, NbDialogRefMock } from 'core/testing';
import { User, UserType } from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';
import { AddUserComponent } from './add-user.component';

class FakeAddUser implements Action {
  readonly type = 'addTab';
  constructor(payload: {
    user: Partial<User>;
    accountId: string;
  }) {}
}

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let store: Store<IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddUserComponent,
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
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    component.customerId = '12345';
    component.addAction = FakeAddUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Click add user button', () => {
    it('should dispatch addUserAction', () => {
      component.formGroup.setValue(getUserFormValue());
      
      triggerMouseClick(fixture, '.btn');

      expect(store.dispatch).toHaveBeenCalledWith(new FakeAddUser(getUserFormValue()));
    });

    it('should not dispatch action to add user if form is invalid', () => {
      component.formGroup.patchValue(getUserFormValue(''));
      
      triggerMouseClick(fixture, '.btn');

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});

function getUserFormValue(firstName = 'user name') {
  return {
    user: {
      firstName,
      lastName: 'last name',
      email: 'email@gmail.com',
      type: UserType.ADMIN,
    },
    accountId: '12345',
  };
}
