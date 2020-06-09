import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramSidebarTabTypes } from '../../../../models/goJsDiagram.model';
import { DiagramTabComponent } from './diagram-tab.component';

describe('TabComponent', () => {
  let component: DiagramTabComponent;
  let fixture: ComponentFixture<DiagramTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('needDisplay', () => {
    it('should return true if type is equal to tab type', () => {
      component.type = DiagramSidebarTabTypes.Tools;

      expect(component.needDisplay(DiagramSidebarTabTypes.Tools)).toBeTruthy();
    });

    it('should return false if type is not equal to tab type', () => {
      component.type = DiagramSidebarTabTypes.Tools;

      expect(component.needDisplay(DiagramSidebarTabTypes.Details)).toBeFalsy();
    });
  });
});
