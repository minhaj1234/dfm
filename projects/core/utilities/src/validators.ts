import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import * as DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'hr', 'a', 'ul', 'ol', 'li', 
  'img', 'div', 'span', 'b','strong', 'i', 'em', 'small', 'del', 'ins', 'sub', 'sup'
];

export function safeHtmlValidator(control: AbstractControl): ValidationErrors {
  return control.value !== DOMPurify.sanitize(control.value, {ALLOWED_TAGS}) 
    ? {safeHtml: true} 
    : null;
}

export function domainsValidator(control: AbstractControl): ValidationErrors {
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/; 
  const domains: string[] = control.value.split(',');

  return domains
    .filter((domain) => domain !== '')
    .some((domain) => !domainRegex.test(domain))
      ? { domains: true }
      : null;
}

export function confirmPasswordValidator(abstractControl: FormGroup): void {
  const newPassword = abstractControl.controls.newPassword.value;
  const confirmPassword = abstractControl.controls.confirmPassword.value;
  
  return newPassword !== confirmPassword
    ? abstractControl.controls.confirmPassword.setErrors({ matchPassword: true })
    : abstractControl.controls.confirmPassword.setErrors(null);
}
