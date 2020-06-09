import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { rootActions } from 'core/root-store';
import { DfmObjects, ObjectClassNames, ObjectRelationsNames } from '../../../../models/objects.model';
import {IDecisionFirstState } from '../../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-relation-objects-display',
  styleUrls: ['./relation-objects-display.component.scss'],
  templateUrl: './relation-objects-display.component.html',
})
export class RelationObjectsDisplayComponent {
  @Input() caption: string;
  @Input() addAction: rootActions.AddRelatedObjectAction;
  @Input() removeAction: rootActions.RemoveRelatedObjectAction;
  @Input() relationObjectsKey: ObjectRelationsNames;
  @Input() to: any;
  @Input() maxCount = 9999;
  @Input() acceptsType: ObjectClassNames;
  @Input() isReadOnly: boolean;
  @ViewChild('divRelationObjectDisplay', { static: true }) divRelationObjectDisplay: ElementRef;

  isAddAllowed = (dragData: DfmObjects): boolean => {
    return !!this.to && this.isCanAdd() && this.insideComponentConstraints(dragData) && this.notAlreadyUsed(dragData);
  };

  get dfmObjectsList(): DfmObjects[] {
    return this.to ? this.to[this.relationObjectsKey] : [];
  }

  get dfmSingleObject(): DfmObjects {
    return this.to ? this.to[this.relationObjectsKey] : null;
  }

  constructor(private store: Store<IDecisionFirstState>) { }

  add(dfmObject: DfmObjects): void {
    this.store.dispatch(new this.addAction({
      sourceObject: this.to,
      relatedObject: dfmObject,
      relationPath: this.relationObjectsKey,
    }));
  }

  private notAlreadyUsed(dragData: DfmObjects): boolean {
    return dragData.id !== this.to.id &&
      (this.isRelationObjectArray() ?
        this.dfmObjectsList.every((graphable) => graphable.id !== dragData.id) :
        !this.dfmSingleObject);
  }

  private insideComponentConstraints(dragData: DfmObjects): boolean {
    return this.acceptsType === dragData.className;
  }

  updateDataInAutocompleteSearchList(): void {
    this.divRelationObjectDisplay.nativeElement.scrollIntoView();
  }

  isCanAdd(): boolean {
    return !!this.addAction && !this.isReadOnly && this.isLessMaxCount();
  }

  isLessMaxCount(): boolean {
    return this.isRelationObjectArray() ?
      this.dfmObjectsList.length < this.maxCount :
      !this.dfmSingleObject;
  }

  isRelationObjectArray(): boolean {
    return this.to && Array.isArray(this.to[this.relationObjectsKey]);
  }
}
