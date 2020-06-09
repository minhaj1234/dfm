import { forwardRef, Component, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { createSpyFromClass } from 'jasmine-auto-spies';

export function MockComponent(options: Component, valueAccessor: boolean = false): Component {
  class Mock {}

  const metadata: Component = {
    exportAs: options.exportAs || '',
    inputs: options.inputs,
    outputs: options.outputs || [],
    selector: options.selector,
    template: options.template || '',
  };

  const valueAccessorMethods = ['writeValue', 'registerOnChange', 'registerOnTouched'];

  metadata.outputs.forEach((method) => {
    Mock.prototype[method] = new EventEmitter<any>();
  });

  if (valueAccessor) {
    metadata.providers = [
      {
        multi: true,
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => Mock),
      },
    ];
    valueAccessorMethods.forEach((method) => {
      Mock.prototype[method] = () => null;
    });
  }

  return Component(metadata)(Mock as any);
}

export function MockProvider(type) {
  return {
    provide: type,
    useValue: createSpyFromClass(type)
  }
}