import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import * as go from 'gojs';
import { DmsThemeModule } from '../../../../theme';
import { Decision } from '../../../models/decision.model';
import { 
  DEFAULT_ANNOTATION_DIAGRAM_NODE, 
  DEFAULT_DECISION_DIAGRAM_NODE, 
  DEFAULT_GROUP_ITEM_DIAGRAM_NODE, 
  DEFAULT_INPUT_DATA_DIAGRAM_NODE, 
  DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE
} from '../../../models/goJsDiagram.model';
import { InputData } from '../../../models/inputData.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { GoJsAddObjectPaletteComponent } from './go-js-add-object-palette.component';

describe('GoJsAddObjectPaletteComponent', () => {
  let component: GoJsAddObjectPaletteComponent;
  let fixture: ComponentFixture<GoJsAddObjectPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoJsAddObjectPaletteComponent],
      imports: [DmsThemeModule, TranslateModule.forRoot()],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoJsAddObjectPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('nodeDataArray', () => {
    it('should set initial data', () => {
      const nodeDataArray = [
        {
          ...DEFAULT_DECISION_DIAGRAM_NODE,
          isNew: true,
          data: new Decision(),
          key: jasmine.any(Number),
          __gohashid: jasmine.any(Number),
        },
        {
          ...DEFAULT_INPUT_DATA_DIAGRAM_NODE,
          isNew: true,
          data: new InputData(),
          key: jasmine.any(Number),
          __gohashid: jasmine.any(Number),
        },
        {
          ...DEFAULT_KNOWLEDGE_SOURCE_DIAGRAM_NODE,
          isNew: true,
          data: new KnowledgeSource(),
          key: jasmine.any(Number),
          __gohashid: jasmine.any(Number),
        },
        {
          ...DEFAULT_GROUP_ITEM_DIAGRAM_NODE,
          isNew: true,
          key: jasmine.any(Number),
          __gohashid: jasmine.any(Number),
        },
        {
          ...DEFAULT_ANNOTATION_DIAGRAM_NODE,
          isNew: true,
          key: jasmine.any(Number),
          __gohashid: jasmine.any(Number),
        }
      ];

      expect(component.palette.model.nodeDataArray).toEqual(nodeDataArray);
    });
  })
});
