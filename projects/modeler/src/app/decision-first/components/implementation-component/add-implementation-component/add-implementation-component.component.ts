import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { AddObjectComponent } from 'core/components';
import { MaxTextLengthCategory } from 'core/components'
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as fromModelerStore from '../../../store';
import * as fromActions from '../../../store/actions';
import * as fromSelectors from '../../../store/selectors';
import { AddSystemComponent } from '../../system/add-system/add-system.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-add-implementation-component',
  templateUrl: './add-implementation-component.component.html',
  styleUrls: ['./add-implementation-component.component.scss']
})
export class AddImplementationComponentComponent extends AddObjectComponent implements OnInit, OnDestroy {
  maxTextLengthCategory = MaxTextLengthCategory;
  icons: ImplementationComponentIcon[];
  selectedIconId: string;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private nbDialogRef: NbDialogRef<AddSystemComponent>,
  ) {
    super(modelerStore, nbDialogRef);
    this.formGroup = this.getImplementationComponentForm();
    this.addAction = fromModelerStore.AddImplementationComponent;
  }

  ngOnInit() {
    this.loadImplementationComponentsIcons();
    this.subscribeImplementationComponentIcons();
  }

  loadImplementationComponentsIcons(): void {
    this.modelerStore.dispatch(new fromActions.LoadImplementationComponentsIcons());
  }

  subscribeImplementationComponentIcons(): void {
    this.modelerStore.pipe(
      select(fromSelectors.getImplementationComponentsIconsAsArray),
      untilDestroyed(this)
    ).subscribe((icons) => {
      this.icons = icons;
      if (icons && icons.length && !this.selectedIconId) {
        this.selectedIconId = icons[0].id;
        this.formGroup.patchValue({iconId: this.selectedIconId});
      }
    });
  }

  getImplementationComponentForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      url: new FormControl(''),
      iconId: new FormControl(''),
    });
  }

  ngOnDestroy() { }
}
