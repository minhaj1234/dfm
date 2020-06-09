import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NbCardModule } from '@nebular/theme';
import { Action, StoreModule } from '@ngrx/store';
import { MockComponent } from 'core/testing';
import { of } from 'rxjs';
import { Customer } from 'user-management/models';
import { EditCustomerContainerTabComponent } from './edit-customer-container-tab.component';

class FakeLoadCustomer implements Action {
  readonly type = 'Fake Load Customer';
  constructor(public payload: string) { }
}

describe('EditCustomerContainerTabComponent', () => {
  let component: EditCustomerContainerTabComponent;
  let fixture: ComponentFixture<EditCustomerContainerTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditCustomerContainerTabComponent,
        MockComponent({ selector: 'user-management-edit-customer-container', inputs: ['customerId', 'options'] }),
      ],
      imports: [
        StoreModule.forRoot([]),
        NbCardModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerContainerTabComponent);
    component = fixture.componentInstance;
    component.options = {
      loadCustomerAction: FakeLoadCustomer,
      getSelectedCustomerSelector: () => (id: string) => new Customer(),
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
