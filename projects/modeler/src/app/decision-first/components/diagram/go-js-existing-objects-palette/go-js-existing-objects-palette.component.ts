import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { IPagination } from 'core/models';
import { convertKeyedArraysToMap } from 'core/utilities';
import { diff } from 'deep-diff';
import * as go from 'gojs';
import { Observable } from 'rxjs';
import { IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import * as fromModelerStore from '../../../store';
import { groupDiffs } from '../../../utilitites/groupDiffsFromDeepDiff';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-go-js-existing-objects-palette',
  styleUrls: ['./go-js-existing-objects-palette.component.scss'],
  templateUrl: './go-js-existing-objects-palette.component.html',
})
export class GoJsExistingObjectsPaletteComponent implements OnInit, OnDestroy {
  fromModelerStore = fromModelerStore;
  searchTermInput = new FormControl('');
  pagination$: Observable<IPagination>;
  public palette: go.Palette = new go.Palette();
  private toOmitFromCompare = {
    __gohashid: true,
  };

  @ViewChild('paletteDiv', { static: true }) private paletteRef: ElementRef;
  @Output() close = new EventEmitter();
  @Input() isClosable = false;

  @Input()
  set existingObjects(existingObjects: IGoJsDiagramNode[]) {
    if (existingObjects) {
      const newPaletteMap = convertKeyedArraysToMap(existingObjects);
      const oldPaletteMap = convertKeyedArraysToMap(this.palette.model.nodeDataArray as any[]);

      const diffs = diff(oldPaletteMap, newPaletteMap);
      const groupedDiffs = groupDiffs(diffs, this.toOmitFromCompare);

      this.palette.startTransaction('async data');
      this.handleNodeRemovals(groupedDiffs.D);
      this.handleNodeAdditions(groupedDiffs.N);
      this.handleEditedNodes(groupedDiffs.E);
      this.palette.commitTransaction('async data');
    }
  }

  constructor(
    public modelerStore: Store<fromModelerStore.IDecisionFirstState>
  ) {
    this.fillPalette();
  }

  fillPalette(): void {
    this.fillPaletteProperties();
    this.fillPaletteLayout();
    this.fillPaletteNodeTemplate();
  }

  fillPaletteProperties(): void {
    this.palette.autoScrollRegion = 0;
  }

  fillPaletteLayout(): void {
    this.palette.layout = go.GraphObject.make(go.GridLayout, { wrappingColumn: 1 });
  }

  fillPaletteNodeTemplate(): void {
    this.palette.nodeTemplate = go.GraphObject.make(
      go.Node,
      'Horizontal',
      { selectionAdorned: false },
      go.GraphObject.make(
        go.Shape,
        {
          fill: '#ffffff',
          height: 30,
          stroke: '#000000',
          strokeWidth: 1,
          width: 30,
          margin: 5,
        },
        new go.Binding('figure', 'shape'),
        new go.Binding('geometryString', 'geometryString'),
      ),
      go.GraphObject.make(go.TextBlock, new go.Binding('text', 'text')),
    );
  }

  ngOnInit() {
    this.palette.div = this.paletteRef.nativeElement;
    this.pagination$ = this.modelerStore.pipe(select(fromModelerStore.getDiagrammingElementsPagination));
    this.palette.addDiagramListener('ChangingSelection', () => this.onClose());
  }

  handleNodeRemovals(removals: deepDiff.IDiff[] = []) {
    const oldNodes = removals.filter((remove) => remove.path.length === 1).map((remove) => remove.lhs);

    this.palette.model.removeNodeDataCollection(oldNodes);
  }
  handleNodeAdditions(adds: deepDiff.IDiff[] = []) {
    const newNodes = adds.filter((add) => add.path.length === 1).map((add) => add.rhs);

    this.palette.model.addNodeDataCollection(newNodes);
  }

  handleEditedNodes(edits: deepDiff.IDiff[] = []) {
    edits.filter((edit) => edit.path.length === 2).forEach((edit) => {
      const node = this.palette.model.findNodeDataForKey(edit.path[0]);
      this.palette.model.setDataProperty(node, edit.path[1], edit.rhs);
    });
  }

  onClose(): void {
    this.close.next()
  }

  ngOnDestroy() {}
}
