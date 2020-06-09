import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EditCustomerContainerOptions } from '../edit-customer-container/interfaces';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-customer-container-tab',
  templateUrl: './edit-customer-container-tab.component.html',
  styleUrls: ['./edit-customer-container-tab.component.scss']
})
export class EditCustomerContainerTabComponent {
  @Input() customerId: string;
  @Input() options: EditCustomerContainerOptions;
}
