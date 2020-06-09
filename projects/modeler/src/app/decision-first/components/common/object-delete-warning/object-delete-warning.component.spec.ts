import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectDeleteWarningComponent } from './object-delete-warning.component';

describe('ObjectDeleteWarningComponent', () => {
  let component: ObjectDeleteWarningComponent;
  let fixture: ComponentFixture<ObjectDeleteWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectDeleteWarningComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectDeleteWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
