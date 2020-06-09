import { ComponentFixture } from '@angular/core/testing';
import { getDebugElement } from './getDebugElement.spec';

export function triggerMouseClick<T>(fixture: ComponentFixture<T>, selector: string): void {
  getDebugElement(fixture, selector).triggerEventHandler('click', null);
}
