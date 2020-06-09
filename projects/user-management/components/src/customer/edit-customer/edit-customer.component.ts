import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { EditObjectComponent } from 'core/components';
import { domainsValidator, safeHtmlValidator } from 'core/utilities';
import { Guid } from 'guid-typescript';
import { ClipboardService } from 'ngx-clipboard';
import { Customer, EditCustomerFormEditableType} from 'user-management/models';
import { IDecisionFirstState } from 'user-management/store/reducers';

const MIN_NUMBER_OF_USERS = 1;
const MAX_NUMBER_OF_USERS = 1000;

const EDITABLE_TYPE_MAPPING = {
  [EditCustomerFormEditableType.AllWithoutDomains]: (formGroup: FormGroup) => {
    formGroup.controls.domains.disable();
  },
  [EditCustomerFormEditableType.HtmlFooterAndDomainsOnly]: (formGroup: FormGroup) => {
    formGroup.controls.name.disable();
    formGroup.controls.validDate.disable();
    formGroup.controls.numberOfUsers.disable();
    formGroup.controls.domains.enable();
  }
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'user-management-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.scss']
})
export class EditCustomerComponent extends EditObjectComponent<Customer> {
  @Input() updateAction: any;
  @Input() debounceTime: number;
  @Input() set editableType(value: EditCustomerFormEditableType) {
    EDITABLE_TYPE_MAPPING[value](this.formGroup);
  }

  constructor(
    private userManagementStore: Store<IDecisionFirstState>,
    private clipboardService: ClipboardService,
    private toastrService: NbToastrService,
  ) {
    super(userManagementStore);
    this.formGroup = this.getCustomerForm();
    this.updateAction = this.updateAction;
    this.debounceTime = this.debounceTime;
  }
 
  getCustomerForm(): FormGroup {
    return new FormGroup({
      id: new FormControl({value: null, disabled: true}, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      apiKey: new FormControl(null, [Validators.required]),
      createdDate: new FormControl({ value: null, disabled: true }, [Validators.required]),
      validDate: new FormControl(null, [Validators.required]),
      numberOfUsers: new FormControl('', [Validators.required, Validators.min(MIN_NUMBER_OF_USERS), Validators.max(MAX_NUMBER_OF_USERS)]),
      footerHtml: new FormControl('', [safeHtmlValidator]),
      domains: new FormControl('', [domainsValidator]),
    });
  }

  setValueFormGroup(): void {
    if (this.editObject && this.formGroup) {
      this.formGroup.setValue({
        id: this.editObject.id,
        name: this.editObject.name,
        apiKey: this.editObject.apiKey,
        createdDate: new Date(this.editObject.createdDate),
        validDate: new Date(this.editObject.validDate),
        numberOfUsers: this.editObject.numberOfUsers,
        footerHtml: this.editObject.footerHtml,
        domains: this.editObject.domains,
      }, { emitEvent: false });
    }
  }

  generateApiKey(): void {
    this.formGroup.patchValue({
      apiKey: Guid.create().toString(),
    });
  }

  copyApiKey(): void {
    this.clipboardService.copyFromContent(this.formGroup.controls.apiKey.value);
    this.toastrService.success('ApiKey copied', 'Info message');
  }
}
