import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequirementNetworkContainerComponent } from './edit-requirement-network-container.component';

describe('EditRequirementNetworkContainerComponent', () => {
  let component: EditRequirementNetworkContainerComponent;
  let fixture: ComponentFixture<EditRequirementNetworkContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRequirementNetworkContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequirementNetworkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
