import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { MockComponent } from 'core/testing';
import { User, UserType } from 'user-management/models';
import { EditUserComponent } from './edit-user.component';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditUserComponent,
        MockComponent({ selector: 'core-edit-multiple-lines-control', inputs: ['formControlName', 'isRichEditor', 'maxTextLength', 'isReadOnly', 'isSingleLine'] }, true),
        MockComponent({ selector: 'core-tag', inputs: ['id', 'text'] }),
        MockComponent({ selector: 'user-management-change-password', inputs: ['formState'], outputs: ['changePassword', 'openForm', 'closeForm'] }),
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot([]),
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    component.getChangePasswordFormStateSelector = 'getChangePasswordFormStateSelector';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isAdmin', () => {
    it('should return true if current user type is Admin', () => {
      component.authenticatedUser = {userType: UserType.ADMIN} as AuthenticatedUser;

      const isAdmin = component.isAdmin();

      expect(isAdmin).toBeTruthy();
    });

    it('should return false if current user type is not Admin', () => {
      component.authenticatedUser = {userType: UserType.STANDARD} as AuthenticatedUser;

      const isAdmin = component.isAdmin();

      expect(isAdmin).toBeFalsy();
    });
  });

  describe('isCurrentUser', () => {
    it('should return true if current user id is equal to user id', () => {
      component.authenticatedUser = {userId: 'user123'} as AuthenticatedUser;
      component.editObject = { id: 'user123'} as User;

      const isCurrentUser = component.isCurrentUser();

      expect(isCurrentUser).toBeTruthy();
    });

    it('should return false if current user id is not equal to user id', () => {
      component.authenticatedUser = {userId: 'user123'} as AuthenticatedUser;
      component.editObject = { id: 'user'} as User;

      const isCurrentUser = component.isCurrentUser();

      expect(isCurrentUser).toBeFalsy();
    });
  });
});
