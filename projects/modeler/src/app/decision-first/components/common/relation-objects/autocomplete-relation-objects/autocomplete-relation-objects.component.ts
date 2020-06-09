import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { AutocompleteListItem } from 'core/models';
import { rootActions } from 'core/root-store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { Config } from '../../../../../config';
import { DfmObjects, ObjectClassNames, ObjectRelationsNames } from '../../../../models/objects.model';
import { IDecisionFirstState } from '../../../../store';
import * as fromStore from '../../../../store';
import { AddBusinessObjectiveComponent } from '../../../business-objective/add-business-objective/add-business-objective.component';
import { AddDecisionComponent } from '../../../decision/add-decision/add-decision.component';
import { AddEventComponent } from '../../../event/add-event/add-event.component';
import { AddImplementationComponentComponent } from '../../../implementation-component/add-implementation-component/add-implementation-component.component';
import { AddInputDataComponent } from '../../../input-data/add-input-data/add-input-data.component';
import { AddKnowledgeSourceComponent } from '../../../knowledge-source/add-knowledge-source/add-knowledge-source.component';
import { AddOrganizationComponent } from '../../../organization/add-organization/add-organization.component';
import { AddProcessComponent } from '../../../process/add-process/add-process.component';
import { AddSystemComponent } from '../../../system/add-system/add-system.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-autocomplete-relation-objects',
  templateUrl: './autocomplete-relation-objects.component.html',
  styleUrls: ['./autocomplete-relation-objects.component.scss']
})
export class AutocompleteRelationObjectsComponent implements OnInit, OnDestroy {
  @Input() to: DfmObjects;
  @Input() acceptType: ObjectClassNames;
  @Input() addAction: rootActions.AddRelatedObjectAction;
  @Input() relationObjectsKey: ObjectRelationsNames;
  @Output() updateDataInAutocompleteSearchList: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('autocompleteRelationObjects', { static: true }) autocompleteRelationObjects: ElementRef;

  searchControl: FormControl = new FormControl('');
  isShowAutocompleteList = false;
  isNeedUpdateAutocompleteSearch = true;
  outsideClick: () => void;
  autocompleteSearchList$: Observable<AutocompleteListItem[]>;

  subscriptionSearchControlValueChanges: Subscription;
  subscriptionAutocompleteSearchList: Subscription;

  get dfmObjectsList(): DfmObjects[] {
    return this.to ? this.to[this.relationObjectsKey] : [];
  }

  get dfmSingleObject(): DfmObjects {
    return this.to ? this.to[this.relationObjectsKey] : null;
  }

  constructor(
    private nbDialogService: NbDialogService,
    private renderer: Renderer2,
    private store: Store<IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.autocompleteSearchList$ = this.store.pipe(select(fromStore.getAutocompleteSearchList));
  }

  updateSearch(): void {
    const pageSize = 3;

    this.store.dispatch(new fromStore.UpdateSearchForAutocompleteSearchList({
      searchTerm: this.searchControl.value,
      objectTypes: [this.acceptType],
      pageSize: pageSize,
      excludeIds: this.getSearchExcludeIds(),
    }));
  }

  getSearchExcludeIds(): string {
    const excludeIds = `${this.to.id},`;
    return this.isRelationObjectArray() ?
      excludeIds.concat(...this.dfmObjectsList.map((object) => `${object.id},`)) :
      excludeIds.concat(this.dfmSingleObject ? this.dfmSingleObject.id : '');
  }

  isRelationObjectArray(): boolean {
    return this.to && Array.isArray(this.to[this.relationObjectsKey]);
  }

  inputSearch(): void {
    this.openAutocompleteList();
  }

  clickSearch(): void {
    this.openAutocompleteList();
  }

  openAutocompleteList(): void {
    if (!this.isShowAutocompleteList) {
      this.isShowAutocompleteList = true;
      this.subscribeAutocompleteSearchList();
      this.subscribeSearchControlValueChanges();
      this.subscribeOutsideClick();
      this.updateSearch();
    }
  }

  subscribeAutocompleteSearchList(): void {
    this.subscriptionAutocompleteSearchList =
      this.autocompleteSearchList$
        .pipe(untilDestroyed(this))
        .subscribe(() => setTimeout(() => this.updateDataInAutocompleteSearchList.emit()));
  }

  subscribeSearchControlValueChanges(): void {
    this.subscriptionSearchControlValueChanges = this.searchControl.valueChanges
      .pipe(
        untilDestroyed(this),
        filter(() => this.isShowAutocompleteList),
        filter(() => this.isNeedUpdateAutocompleteSearch),
        debounceTime(Config.searchDebounceTime),
      )
      .subscribe(() => {
        this.updateSearch();
      });
  }

  subscribeOutsideClick(): void {
    this.outsideClick = this.renderer.listen('document', 'click', (event) => {
      if (!this.autocompleteRelationObjects.nativeElement.contains(event.target)) {
        this.closeAutocompleteList();
      }
    });
  }

  closeAutocompleteList(): void {
    if (this.isShowAutocompleteList) {
      this.isShowAutocompleteList = false;
      this.unsubscribeAutocompleteSearchList();
      this.unsubscribeSearchControlValueChanges();
      this.unsubscriveOutsideClick();
      this.resetSearch();
    }
  }

  unsubscribeAutocompleteSearchList(): void {
    this.subscriptionAutocompleteSearchList.unsubscribe();
  }

  unsubscribeSearchControlValueChanges(): void {
    this.subscriptionSearchControlValueChanges.unsubscribe();
  }

  unsubscriveOutsideClick(): void {
    if (this.outsideClick) {
      this.outsideClick();
      this.outsideClick = undefined;
    }
  }

  resetSearch(): void {
    this.isNeedUpdateAutocompleteSearch = false;
    this.store.dispatch(new fromStore.SetAutocompleteSearchListInitialState());
    this.searchControl.setValue('');
    this.isNeedUpdateAutocompleteSearch = true;
  }

  addRelationObject(dfmObject: DfmObjects): void {
    this.store.dispatch(new this.addAction({
      sourceObject: this.to,
      relatedObject: dfmObject,
      relationPath: this.relationObjectsKey,
    }));

    this.closeAutocompleteList();
  }

  openDialogCreateObject(): void {
    switch (this.acceptType) {
      case ObjectClassNames.Decision:
        this.nbDialogService.open(AddDecisionComponent);
        break;
      case ObjectClassNames.InputData:
        this.nbDialogService.open(AddInputDataComponent);
        break;
      case ObjectClassNames.KnowledgeSource:
        this.nbDialogService.open(AddKnowledgeSourceComponent);
        break;
      case ObjectClassNames.Organization:
        this.nbDialogService.open(AddOrganizationComponent);
        break;
      case ObjectClassNames.BusinessObjective:
        this.nbDialogService.open(AddBusinessObjectiveComponent);
        break;
      case ObjectClassNames.Process:
        this.nbDialogService.open(AddProcessComponent);
        break;
      case ObjectClassNames.Event:
        this.nbDialogService.open(AddEventComponent);
        break;
      case ObjectClassNames.System:
        this.nbDialogService.open(AddSystemComponent);
        break;
      case ObjectClassNames.ImplementationComponent:
        this.nbDialogService.open(AddImplementationComponentComponent);
        break;
    }

    this.closeAutocompleteList();
  }

  ngOnDestroy() { }
}
