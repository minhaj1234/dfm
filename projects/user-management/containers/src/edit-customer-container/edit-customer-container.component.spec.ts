import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule } from '@nebular/theme';
import { Action, StoreModule } from '@ngrx/store';
import { MockComponent } from 'core/testing';
import { Customer } from 'user-management/models';
import { UsersService } from 'user-management/services';
import { FakeUsersService } from 'user-management/testing';
import { EditCustomerContainerComponent } from './edit-customer-container.component';

class FakeLoadCustomer implements Action {
  readonly type = 'Fake Load Customer';
  constructor(public payload: string) { }
}

describe('EditCustomerContainerComponent', () => {
  let component: EditCustomerContainerComponent;
  let fixture: ComponentFixture<EditCustomerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditCustomerContainerComponent,
        MockComponent({ selector: 'user-management-edit-customer', inputs: ['editObject', 'debounceTime', 'updateAction', 'editableType'] }),
        MockComponent({ selector: 'user-management-users-table', inputs: ['users', 'addTabAction', 'addUserAction', 'customerId', 'deleteUserAction'] }),
        MockComponent({ selector: 'user-management-groups-table', inputs: ['groups', 'addTabAction', 'addGroupAction', 'customerId', 'deleteGroupAction'] }),
        MockComponent({ selector: 'core-implementation-component-icon-table-container', inputs: [] }),
      ],
      imports: [
        StoreModule.forRoot([]),
        NbCardModule,
      ],
      providers: [
        { provide: UsersService, useValue: new FakeUsersService() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerContainerComponent);
    component = fixture.componentInstance;
    component.options = {
      loadCustomerAction: FakeLoadCustomer,
      getSelectedCustomerSelector: () => (id: string) => new Customer(),
      getAuthenticatedUserSelector: () => () => { },
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
