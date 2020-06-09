import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { getDebugElement, MockComponent } from 'core/testing';
import { PrintDiagramComponent } from '../../..';
import { DmsThemeModule } from '../../../../../theme';
import { Decision } from '../../../../models/decision.model';
import { Diagram } from '../../../../models/diagram.model';
import { InputData } from '../../../../models/inputData.model';
import { KnowledgeSource } from '../../../../models/knowledgeSource.model';

describe('PrintDiagramComponent', () => {
  let component: PrintDiagramComponent;
  let fixture: ComponentFixture<PrintDiagramComponent>;
  const diagram = new Diagram();
  diagram.decisions = [{id: 'decision1'} as Decision];
  diagram.inputDatas = [{id: 'inputData1'} as InputData];
  diagram.knowledgeSources = [{id: 'knowledgeSource1'} as KnowledgeSource];


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrintDiagramComponent,
        MockComponent({ selector: 'dfm-print-object', inputs: ['object', 'topLevelHeading'] }),
      ],
      imports: [
        DmsThemeModule,
        TranslateModule.forRoot(),
      ],
    })
    .overrideComponent(PrintDiagramComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDiagramComponent);
    component = fixture.componentInstance;
    component.diagram = diagram;
    component.image = getTestSvgElement();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when includeRelatedObjects is true', () => {
    beforeEach(() => {
      component.includeRelatedObjects = true;
      fixture.detectChanges();
    });

    it('should display related decisions', () => {
      const element = getDebugElement(fixture, '.related-decisions');

      expect(element).toBeTruthy();
    });

    it('should display related input data', () => {
      const element = getDebugElement(fixture, '.related-input-data');

      expect(element).toBeTruthy();
    });

    it('should display related knowledge source', () => {
      const element = getDebugElement(fixture, '.related-knowledge-source');

      expect(element).toBeTruthy();
    });
  });

  describe('when includeRelatedObjects is false', () => {
    beforeEach(() => {
      component.includeRelatedObjects = false;
      fixture.detectChanges();
    });

    it('should not display related decisions', () => {
      const element = getDebugElement(fixture, '.related-decisions');

      expect(element).toBeFalsy();
    });

    it('should not display related input data', () => {
      const element = getDebugElement(fixture, '.related-input-data');

      expect(element).toBeFalsy();
    });

    it('should display related knowledge source', () => {
      const element = getDebugElement(fixture, '.related-knowledge-source');

      expect(element).toBeFalsy();
    });
  });

  describe('getObjectsInAlphabeticalOrder', () => {
    it('should return objects in alphabetical order by name', () => {
      const result = component.getObjectsInAlphabeticalOrder([{name: 'b'} as Decision, {name: 'c'} as Decision, {name: 'a'} as Decision]);

      expect(result).toEqual([{name: 'a'} as Decision, {name: 'b'} as Decision, {name: 'c'} as Decision]);
    });
  });

  function getTestSvgElement(): SVGSVGElement {
    return document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }
});
