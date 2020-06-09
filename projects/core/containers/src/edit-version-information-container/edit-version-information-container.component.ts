import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { VersionInformation } from 'core/models';
import { rootReducers } from 'core/root-store';
import { rootActions, rootSelectors } from 'core/root-store';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-edit-version-information-container',
  styleUrls: ['./edit-version-information-container.component.scss'],
  templateUrl: './edit-version-information-container.component.html',
})
export class EditVersionInformationContainerComponent implements OnInit {
  state$: Observable<VersionInformation>;

  constructor(
    private store: Store<rootReducers.versionInformationReducer.IVersionInformationState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new rootActions.LoadVersionInformation);

    this.state$ = this.store.select(rootSelectors.getVersionInformation);
  }
}
