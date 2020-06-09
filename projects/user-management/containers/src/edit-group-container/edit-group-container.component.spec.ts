import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule } from '@nebular/theme';
import { Action, StoreModule } from '@ngrx/store';
import { MockComponent } from 'core/testing';
import { Group, UserType } from 'user-management/models';
import { EditGroupContainerComponent } from './edit-group-container.component';

class FakeLoadGroup implements Action {
  readonly type = 'Fake Load Group';
  constructor(public payload: string) { }
}

describe('EditGroupContainerComponent', () => {
  let component: EditGroupContainerComponent;
  let fixture: ComponentFixture<EditGroupContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditGroupContainerComponent,
        MockComponent({ selector: 'user-management-edit-group', inputs: ['editObject', 'updateAction', 'debounceTime', 'isReadOnly'] }),
        MockComponent({ selector: 'user-management-users-table', inputs: [
          'users', 
          'addTabAction', 
          'addUserAction', 
          'isReadOnly',
          'groupId',
          'customerId',
          'getAutocompleteSearchListSelector',
          'addUsersToGroupAction',
          'removeUserFromGroupAction',
          'loadUsersToAutocompleteSearchListAction',
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
    fixture = TestBed.createComponent(EditGroupContainerComponent);
    component = fixture.componentInstance;
    component.options = {
      loadGroupAction: FakeLoadGroup,
      getSelectedGroupSelector: () => (id: string) => new Group(),
      getAuthenticatedUserType: () => (id: string) => '',
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isAdmin', () => {
    it('should return true if user type is Admin', () => {
      const isAdmin = component.isAdmin(UserType.ADMIN);

      expect(isAdmin).toBeTruthy();
    });

    it('should return false if user type is not Admin', () => {
      const isAdmin = component.isAdmin(UserType.STANDARD);

      expect(isAdmin).toBeFalsy();
    });
  });
});
