import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function answerRangeValidator(
  nameMinimumFormControl: string,
  nameMaximumFormControl: string,
  nameDefaultFormControl: string,
): ValidatorFn {
  return (formControl: FormControl): ValidationErrors | null => {
    if (formControl.parent) {
      return getValidateRangeResult(
        formControl,
        nameMinimumFormControl,
        nameMaximumFormControl,
        nameDefaultFormControl,
      );
    } else {
      return null;
    }
  };
}

function getValidateRangeResult(
  formControl: FormControl,
  nameMinimumFormControl: string,
  nameMaximumFormControl: string,
  nameDefaultFormControl: string,
): ValidationErrors | null {
  const minimumValue = formControl.parent.controls[nameMinimumFormControl].value;
  const maximumValue = formControl.parent.controls[nameMaximumFormControl].value;
  const defaultValue = formControl.parent.controls[nameDefaultFormControl].value;

  if (!minimumValue || !maximumValue || !defaultValue) return null;

  switch (getFormControlName(formControl)) {
    case nameMinimumFormControl:
      return getValidateMinimalRangeResult(minimumValue, maximumValue, defaultValue);
    case nameMaximumFormControl:
      return getValidateMaximumRangeResult(minimumValue, maximumValue, defaultValue);
    case nameDefaultFormControl:
      return getValidateDefaultRangeResult(minimumValue, maximumValue, defaultValue);
  }
}

function getFormControlName(formControl: FormControl): string {
  const formGroup = formControl.parent;
  let name: string;

  Object.keys(formGroup.controls).forEach((key) => {
    const childControl = formGroup.get(key);

    if (childControl === formControl) {
      name = key;
      return;
    }
  });

  return name;
}

function getValidateMinimalRangeResult(
  minimumValue: any,
  maximumValue: any,
  defaultValue: any,
): ValidationErrors | null {
  if (minimumValue <= maximumValue && minimumValue <= defaultValue) return null;
  return { invalid: true };
}

function getValidateMaximumRangeResult(
  minimumValue: any,
  maximumValue: any,
  defaultValue: any,
): ValidationErrors | null {
  if (maximumValue >= minimumValue && maximumValue >= defaultValue) return null;
  return { invalid: true };
}

function getValidateDefaultRangeResult(
  minimumValue: any,
  maximumValue: any,
  defaultValue: any,
): ValidationErrors | null {
  if (defaultValue >= minimumValue && defaultValue <= maximumValue) return null;
  return { invalid: true };
}
