import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MaxTextLengthCategory } from 'core/components'
import { convertStringToI18nString, setFormAvailability } from 'core/utilities';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Config } from '../../../../config';
import { Graphable } from '../../../models/graphable.model';
import { ObjectClassNames } from '../../../models/objects.model';
import * as fromModelerStore from '../../../store';
import { isDecision } from '../../../utilitites/goJsHelpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-edit-graphable',
  styleUrls: ['./edit-graphable.component.scss'],
  templateUrl: './edit-graphable.component.html',
})
export class EditGraphableComponent implements OnDestroy {
  fromModelerStore = fromModelerStore;
  maxTextLengthCategory = MaxTextLengthCategory;

  graphableForm: FormGroup;
  isSubscribeValueChanges$ = new Subject();
  isDecision = isDecision;

  private _graphable: Graphable;
  @Input() set graphable(graphable: Graphable) {
    this.isSubscribeValueChanges$.next(false);
    this._graphable = graphable;
    this.setValueGraphableForm();
    this.subscribeGraphableFormValueChanges();
  }
  get graphable(): Graphable {
    return this._graphable;
  }

  private _isReadOnly: boolean;
  @Input() set isReadOnly(value: boolean) {
    this._isReadOnly = value;
    setFormAvailability(this.graphableForm, this.isReadOnly);
  }
  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  constructor(private modelerStore: Store<fromModelerStore.IDecisionFirstState>) {
    this.graphableForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
  }

  setValueGraphableForm(): void {
    this.graphableForm.patchValue({
      name: this._graphable.name,
      description: this._graphable.description,
    });

    setFormAvailability(this.graphableForm, this.isReadOnly);
  }

  subscribeGraphableFormValueChanges(): void {
    this.isSubscribeValueChanges$ = new Subject();
    this.graphableForm.valueChanges
      .pipe(
        takeUntil(this.isSubscribeValueChanges$),
        untilDestroyed(this),
        debounceTime(Config.debounceTime),
      )
      .subscribe((results) => {
        if (this.graphableForm.valid) {
          this.dispatchUpdateGraphableAction(results);
        }
      });
  }

  dispatchUpdateGraphableAction(results: Partial<Graphable>): void {
    if (this.graphable.className === ObjectClassNames.Decision) {
      this.modelerStore.dispatch(
        new fromModelerStore.UpdateDecision({
          decision: { ...results, _links: this.graphable._links, id: this.graphable.id },
          objectTagsUpdate: {
            tags: this.graphable.tags,
            name: results.name,
            description: results.description,
          }
        }),
      );
    } else if (this.graphable.className === ObjectClassNames.InputData) {
      this.modelerStore.dispatch(
        new fromModelerStore.UpdateInputData({
          inputData: { ...results, _links: this.graphable._links, id: this.graphable.id },
          objectTagsUpdate: {
            tags: this.graphable.tags,
            name: results.name,
            description: results.description,
          }
        })
      );
    } else if (this.graphable.className === ObjectClassNames.KnowledgeSource) {
      this.modelerStore.dispatch(
        new fromModelerStore.UpdateKnowledgeSource({
          knowledgeSource: { ...results, _links: this.graphable._links, id: this.graphable.id },
          objectTagsUpdate: {
            tags: this.graphable.tags,
            name: results.name,
            description: results.description,
          }
        }),
      );
    }
  }

  getI18nResourceTitleObject(graphable: Graphable): string {
    const type = this.getGraphableType(graphable);
    return `${convertStringToI18nString(type)}Title`;
  }

  getGraphableType(graphable: Graphable): string {
    return graphable.className;
  }

  ngOnDestroy() { }
}
