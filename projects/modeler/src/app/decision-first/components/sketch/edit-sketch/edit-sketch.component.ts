import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaxTextLengthCategory } from 'core/components'
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime, filter } from 'rxjs/operators';
import { Config } from '../../../../config';
import { Diagram } from '../../../models/diagram.model';
import { IGoJsDiagramNode } from '../../../models/goJsDiagram.model';
import * as fromStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-sketch',
  templateUrl: './edit-sketch.component.html',
  styleUrls: ['./edit-sketch.component.scss'],
})
export class EditSketchComponent implements OnInit, OnDestroy {
  sketchForm: FormGroup;
  maxTextLengthCategory = MaxTextLengthCategory;
  private _selectedObject: IGoJsDiagramNode;
  sendChanges = true;
  @Input() diagram: Diagram;
  @Input()
  set selectedObject(selectedObject: IGoJsDiagramNode) {
    this._selectedObject = selectedObject;
    this.sendChanges = false;
    this.setValueSketchForm();
    this.sendChanges = true;
  }

  get selectedObject(): IGoJsDiagramNode {
    return this._selectedObject;
  }

  constructor(private store: Store<fromStore.IDecisionFirstState>) {
    this.createSketchForm();
    this.subscribeSketchFormValueChanges();
  }

  ngOnInit() {}

  createSketchForm(): void {
    this.sketchForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
    });
  }

  subscribeSketchFormValueChanges(): void {
    this.sketchForm.valueChanges
    .pipe(
      filter(() => this.sendChanges),
      untilDestroyed(this),
      debounceTime(Config.debounceTime),
    )
    .subscribe((value: {description: string}) => this.updateSketch(value));
  }

  updateSketch(value: {description: string}): void {
    this.store.dispatch(new fromStore.UpdateSketchObject({diagram: this.diagram, sketch: {id: this.selectedObject.key, description: value.description}}));
  }

  setValueSketchForm(): void {
    this.sketchForm.patchValue({
      description: this.selectedObject.text,
    });
  }

  ngOnDestroy() {};
}
