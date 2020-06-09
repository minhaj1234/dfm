import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule } from '@nebular/theme';
import { Action, StoreModule } from '@ngrx/store';
import { AuthenticatedUser } from 'core/models';
import { MockComponent } from 'core/testing';
import {  User, UserType } from 'user-management/models';
import { EditUserContainerComponent } from './edit-user-container.component';

class FakeLoadUser implements Action {
  readonly type = 'Fake Load User';
  constructor(public payload: string) { }
}

describe('EditUserContainerComponent', () => {
  let component: EditUserContainerComponent;
  let fixture: ComponentFixture<EditUserContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditUserContainerComponent,
        MockComponent({ selector: 'user-management-edit-user', inputs: [
          'editObject', 
          'updateAction', 
          'debounceTime', 
          'authenticatedUser',
          'openChangePasswordFormAction',
          'closeChangePasswordFormAction',
          'getChangePasswordFormStateSelector',
          'changePasswordAction'
        ] }),
        MockComponent({ selector: 'user-management-groups-table', inputs: [
          'groups', 
          'addTabAction', 
          'addGroupAction', 
          'isReadOnly',
          'userId',
          'customerId',
          'addGroupsToUserAction',
          'removeGroupFromUserAction',
          'getAutocompleteSearchListSelector',
          'loadGroupsToAutocompleteSearchListAction',
          'setAutocompleteSearchListInitialStateAction',
          'isReadOnly',
          'searchDebounceTime',
          'autocompleteListPageSize',
        ] }),
      ],
      imports: [
        StoreModule.forRoot([]),
        NbCardModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserContainerComponent);
    component = fixture.componentInstance;
    component.options = {
      loadUserAction: FakeLoadUser,
      getSelectedUserSelector: () => (id: string) => new User(),
      getAuthenticatedUser: () => (id: string) => '',
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('isAdmin', () => {
    it('should return true if current user type is Admin', () => {
      const isAdmin = component.isAdmin({ userType: UserType.ADMIN } as AuthenticatedUser);

      expect(isAdmin).toBeTruthy();
    });

    it('should return false if current user type is not Admin', () => {
      const isAdmin = component.isAdmin({ userType: UserType.STANDARD } as AuthenticatedUser);

      expect(isAdmin).toBeFalsy();
    });
  });
});
