import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { confirmPasswordValidator, domainsValidator, safeHtmlValidator } from "./validators";

describe('safeHtmlValidator', () => {
  it('should return null if html is valid', () => {
    const formControl = new FormControl('<p> valid HTML</p>');
    
    const validationResult = safeHtmlValidator(formControl);

    expect(validationResult).toEqual(null);
  });

  it('should return ValidationErrors if html is not valid', () => {
    const formControl = new FormControl('<p onclick="alert()"> is not valid HTML</p>');
    const expected: ValidationErrors = {safeHtml: true};

    const validationResult = safeHtmlValidator(formControl);

    expect(validationResult).toEqual(expected);
  });
});

describe('domainsValidator', () => {
  it('should return null if domains is valid', () => {
    const formControl = new FormControl('valid.domain,other.valid.domain');
    
    const validationResult = domainsValidator(formControl);

    expect(validationResult).toEqual(null);
  });

  it('should return ValidationErrors if domains is not valid', () => {
    const formControl = new FormControl('not valid.domain,');
    const expected: ValidationErrors = {domains: true};

    const validationResult = domainsValidator(formControl);

    expect(validationResult).toEqual(expected);
  });
});

describe('confirmPasswordValidator', () => {
  it('should not set ValidationErrors if confirm password is valid', () => {
    const form = new FormGroup({
      newPassword: new FormControl('12345678'),
      confirmPassword: new FormControl('12345678')
    });   
     
    confirmPasswordValidator(form);

    expect(form.controls.confirmPassword.errors).toEqual(null);
  });

  it('should set ValidationErrors if confirm password is not valid', () => {
    const form = new FormGroup({
      newPassword: new FormControl('12345678'),
      confirmPassword: new FormControl('123456789')
    });   
    const expected: ValidationErrors = {matchPassword: true};

    confirmPasswordValidator(form);

    expect(form.controls.confirmPassword.errors).toEqual(expected);
  });
});
