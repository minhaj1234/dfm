import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { convertStringToI18nString } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter, take } from 'rxjs/operators';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromStore from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-filter-tool',
  templateUrl: './search-filter-tool.component.html',
  styleUrls: ['./search-filter-tool.component.scss'],
})
export class SearchFilterToolComponent implements OnInit, OnDestroy {
  filterFormGroup: FormGroup;
  countSelectedTypeObjects = 0;
  typeObjects: ObjectClassNames[] = [];
  isListenFilterFormGroupChanges = true;

  constructor(
    private store: Store<fromStore.IDecisionFirstState>,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fillTypeObjects();
    this.fillFilterFormGroup();
    this.subscribeFilterFormGroupValueChanges();
    this.subscribeMainSearchListTypeObjects();
  }

  fillTypeObjects(): void {
    for (const className of Object.keys(ObjectClassNames)) {
      this.typeObjects.push(ObjectClassNames[className]);
    }
  }

  fillFilterFormGroup(): void {
    const typeObjectsFormControls = this.typeObjects.map((control) => new FormControl(false));
    this.filterFormGroup = this.formBuilder.group({
      typeObjects: new FormArray(typeObjectsFormControls),
    });
  }

  getI18nResourceTypeObject(typeObject: string): string {
    return convertStringToI18nString(typeObject);
  }

  subscribeFilterFormGroupValueChanges(): void {
    this.filterFormGroup.valueChanges
      .pipe(
        filter(() => this.isListenFilterFormGroupChanges),
        untilDestroyed(this),
      )
      .subscribe((result) => {
        const selectedTypeObjects = this.getSelectedTypeObjects();
        this.updateSearchMainSearchList(selectedTypeObjects);
      });
  }

  updateSearchMainSearchList(selectedTypeObjects: ObjectClassNames[]): void {
    this.store
      .pipe(
        select(fromStore.getMainSearchListState),
        take(1),
      )
      .subscribe((result) => {
        this.store.dispatch(
          new fromStore.UpdateSearchForMainSearchList({
            searchTerm: result.searchTerm,
            typeObjects: selectedTypeObjects,
          }),
        );
      });
  }

  subscribeMainSearchListTypeObjects(): void {
    this.store
      .pipe(
        select(fromStore.getMainSearchListTypeObjects),
        untilDestroyed(this),
      )
      .subscribe((selectedTypeObjects: ObjectClassNames[]) => {
        this.changeSelectedTypeObjects(selectedTypeObjects);
      });
  }

  changeSelectedTypeObjects(selectedTypeObjects: ObjectClassNames[]): void {
    this.isListenFilterFormGroupChanges = false;

    const controls: any = this.filterFormGroup.controls.typeObjects;

    for (let x = 0; x < this.typeObjects.length; x++) {
      if (selectedTypeObjects.includes(this.typeObjects[x])) controls.at(x).patchValue(true);
      else controls.at(x).patchValue(false);
    }

    this.countSelectedTypeObjects = this.getSelectedTypeObjects().length;
    this.changeDetectorRef.markForCheck();

    this.isListenFilterFormGroupChanges = true;
  }

  getSelectedTypeObjects(): ObjectClassNames[] {
    return this.filterFormGroup.value.typeObjects
      .map((checked: boolean, index: number) => (checked ? this.typeObjects[index] : null))
      .filter((value: string) => value !== null);
  }

  getTypeObjectsControls(): AbstractControl[] {
    return (<FormArray>this.filterFormGroup.get('typeObjects')).controls;
  }

  ngOnDestroy() {}
}
