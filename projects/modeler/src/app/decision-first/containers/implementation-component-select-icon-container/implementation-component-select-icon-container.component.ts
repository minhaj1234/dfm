import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { rootReducers, rootSelectors } from 'core/root-store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImplementationComponent } from '../../models/implementationComponent.model';
import * as fromModelerStore from '../../store';
import * as fromActions from '../../store/actions';
import { IDecisionFirstState } from '../../store/reducers/';
import { IimplementationComponentSelectIconState } from './implementation-component-select-icon-container.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-implementation-component-select-icon-container',
  styleUrls: ['./implementation-component-select-icon-container.component.scss'],
  templateUrl: './implementation-component-select-icon-container.component.html',
})
export class ImplementationComponentSelectIconContainerComponent implements OnInit {
  @Input() objectId: string;
  fromModelerStore = fromModelerStore;
  state$: Observable<IimplementationComponentSelectIconState>;
  selectIconForm: FormGroup;
  editObject: ImplementationComponent;

  constructor(
    private modelerStore: Store<IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
  ) { 
    this.selectIconForm = this.getSelectIconForm();
  }

  ngOnInit() {
    this.subscribeSeletcIconFormState();
    this.subscribeFormValueChanges();
  }

  subscribeSeletcIconFormState(): void {
    this.state$ = combineLatest([
      this.modelerStore.pipe(select(fromModelerStore.getImplementationComponentsIconsAsArray)),
      this.modelerStore.pipe(select(fromModelerStore.getSelectedImplementationComponent(this.objectId))),
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
    ]).pipe(
      map(([icons, editObject, isReadOnlySession]) => {
        this.editObject = editObject;
        
        if (this.editObject && !this.selectIconForm.controls.iconId.value) {
          this.setSelectIconFormValue();
        }

        if (!icons.some((icon) => icon.id === this.editObject.iconId)) {
          this.loadImplementationComponentIcon();
        }

        return { icons, isReadOnlySession }
      })
    );
  }

  setSelectIconFormValue(): void {
    this.selectIconForm.patchValue({ iconId: this.editObject.iconId }, { emitEvent: false });
  }

  loadImplementationComponentIcon():void {
    this.modelerStore.dispatch(new fromActions.LoadImplementationComponentsIcon(this.editObject.iconId));
  }

  getSelectIconForm(): FormGroup {
    return new FormGroup({
      iconId: new FormControl(''),
    });
  }

  subscribeFormValueChanges(): void {
    this.selectIconForm.valueChanges
      .subscribe((value) => {
        const implementationComponent = {
          id: this.editObject.id,
          _links: this.editObject._links,
          ...value,
        };
    
        this.modelerStore.dispatch(new fromActions.UpdateImplementationComponent({
          implementationComponent
        }));
      });
  }

  onSelectIconClick(): void {
    this.modelerStore.dispatch(new fromActions.LoadImplementationComponentsIcons());
  }
}
