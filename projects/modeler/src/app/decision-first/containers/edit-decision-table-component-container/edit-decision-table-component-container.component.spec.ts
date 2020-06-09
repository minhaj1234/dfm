import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDecisionTableComponentContainerComponent } from './edit-decision-table-component-container.component';

describe('EditDecisionTableComponentContainerComponent', () => {
  let component: EditDecisionTableComponentContainerComponent;
  let fixture: ComponentFixture<EditDecisionTableComponentContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDecisionTableComponentContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDecisionTableComponentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
