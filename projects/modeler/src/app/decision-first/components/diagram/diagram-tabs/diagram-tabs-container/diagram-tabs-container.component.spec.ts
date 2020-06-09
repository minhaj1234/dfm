import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramTabComponent } from '../../..';
import { DiagramSidebarTabTypes } from '../../../../models/goJsDiagram.model';
import { DiagramTabsContainerComponent } from './diagram-tabs-container.component';

describe('DiagramTabsContainerComponent', () => {
  let component: DiagramTabsContainerComponent;
  let fixture: ComponentFixture<DiagramTabsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramTabsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramTabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTabClicked', () => {
   it('should call tabSelected emit with null if isDisplayed return true', () => {
    spyOn(component.selectTab, 'emit');

    component.onTabClicked(getTestDiagramTabComponent(DiagramSidebarTabTypes.Tools, true));

    expect(component.selectTab.emit).toHaveBeenCalledWith(null);
   });

   it('should call tabSelected emit with selected tab type if isDisplayed return false', () => {
    spyOn(component.selectTab, 'emit');

    component.onTabClicked(getTestDiagramTabComponent(DiagramSidebarTabTypes.Tools, false));

    expect(component.selectTab.emit).toHaveBeenCalledWith(DiagramSidebarTabTypes.Tools);
   });
  });

  describe('doTabDisplay', () => {
    it('should return true if tab isDisplayed return true', () => {
      const tab = getTestDiagramTabComponent(DiagramSidebarTabTypes.Tools, true);
      component.selectedTabType = DiagramSidebarTabTypes.Tools;

      expect(component.doTabDisplay(tab)).toBeTruthy();
    });

    it('should return false if tab isDisplayed return false', () => {
      const tab = getTestDiagramTabComponent(DiagramSidebarTabTypes.Tools, false);
      component.selectedTabType = DiagramSidebarTabTypes.Tools;

      expect(component.doTabDisplay(tab)).toBeFalsy();
    });
  });
});

function getTestDiagramTabComponent(selectedType: DiagramSidebarTabTypes, isDisplayedValue: boolean): DiagramTabComponent {
  return {
    type: selectedType, 
    needDisplay: (type) => isDisplayedValue,
  } as DiagramTabComponent
}
