import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { Decision } from '../../../models/decision.model';
import { DiagramNodeType, IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import { KnowledgeSource } from '../../../models/knowledgeSource.model';
import { IDecisionFirstState } from '../../../store/reducers';
import { TestStoreModule } from '../../../testing/test-store-module.spec';
import { GoJsExistingObjectsPaletteComponent } from './go-js-existing-objects-palette.component';

describe('GoJsExistingObjectsPaletteComponent', () => {
  let component: GoJsExistingObjectsPaletteComponent;
  let fixture: ComponentFixture<GoJsExistingObjectsPaletteComponent>;
  let modelerStore: Store<IDecisionFirstState>;

  function originalData(): IGoJsDiagramNode[] {
    return [
      {
        data: new Decision(),
        isNew: false,
        key: 'decision1',
        shape: 'RoundedRectangle',
        text: 'Decision One',
        type: DiagramNodeType.Decision,
        hasMissingNodes: false,
      },
      {
        data: new Decision(),
        isNew: false,
        key: 'decision2',
        shape: 'RoundedRectangle',
        text: 'Decision Two',
        type: DiagramNodeType.Decision,
        hasMissingNodes: false,
      },
      {
        data: new KnowledgeSource(),
        isNew: false,
        key: 'knowledgeSource11',
        shape: 'Document',
        text: 'Knowledge Source One',
        type: DiagramNodeType.KnowledgeSource,
        hasMissingNodes: false,
      },
    ];
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GoJsExistingObjectsPaletteComponent,
        MockComponent({ selector: 'dfm-search-control', inputs: ['searchAction'] }),
        MockComponent({ selector: 'core-pagination-load-more', inputs: ['store', 'pagination', 'getMoreAction'] }),
      ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        TestStoreModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GoJsExistingObjectsPaletteComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    modelerStore = TestBed.get(Store);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does nothing if there is no paletteList', () => {
    spyOn(component.palette, 'startTransaction');
    component.existingObjects = null;
    expect(component.palette.startTransaction).not.toHaveBeenCalled();
  });

  it('sets the correct palette items when initial data is set', () => {
    const od = originalData();
    component.existingObjects = od;
    expect(component.palette.model.nodeDataArray.length).toEqual(3);
  });

  it('can add a node to the list without changing any old nodes', () => {
    const od = originalData();
    component.existingObjects = od;
    const originalNodeDataArray = component.palette.model.nodeDataArray;
    const newData = originalData();
    const newNode: IGoJsDiagramNode = {
      data: new Decision(),
      isNew: false,
      key: 'decision3',
      shape: 'RoundedRectangle',
      text: 'Decision Three',
      type: DiagramNodeType.Decision,
      hasMissingNodes: false,
    };
    newData.push(newNode);
    component.existingObjects = newData;
    const newNodeDataArray = component.palette.model.nodeDataArray;
    expect(newNodeDataArray[0]).toBe(originalNodeDataArray[0]);
    expect(newNodeDataArray.length).toEqual(4);
  });

  it('remove a node from the list without changing any other nodes', () => {
    const od = originalData();
    component.existingObjects = od;
    const originalNodeDataArray = component.palette.model.nodeDataArray;
    const newData = originalData().slice(0, 2);
    component.existingObjects = newData;
    const newNodeDataArray = component.palette.model.nodeDataArray;
    expect(newNodeDataArray[0]).toBe(originalNodeDataArray[0]);
    expect(newNodeDataArray.length).toEqual(2);
  });

  it('edits a node without changing any other nodes', () => {
    const od = originalData();
    component.existingObjects = od;
    const originalNodeDataArray = component.palette.model.nodeDataArray;
    const newData = originalData();
    newData[1].text = 'Decision Two New Name';
    component.existingObjects = newData;
    const newNodeDataArray = component.palette.model.nodeDataArray;
    expect(newNodeDataArray[0]).toBe(originalNodeDataArray[0]);
    expect((newNodeDataArray[1] as any).text).toEqual('Decision Two New Name');
  });

  it('changing selection should call onClose', async(() => {
    spyOn(component, 'onClose');
    const od = originalData();
    component.existingObjects = od;

    component.palette.select(component.palette.findNodeForKey('decision1'));

    expect(component.onClose).toHaveBeenCalled();
  }));

  describe('onClose', () => {
    it('should emit close event', async(() => {
      spyOn(component.close, 'next');

      component.onClose();

      expect(component.close.next).toHaveBeenCalled();
    }));
  });
});
