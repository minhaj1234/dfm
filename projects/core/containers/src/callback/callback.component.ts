import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { rootActions, rootReducers } from 'core/root-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-callback',
  styleUrls: ['./callback.component.scss'],
  templateUrl: './callback.component.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private rootStore: Store<rootReducers.IState>
  ) { }

  ngOnInit() {
    this.rootStore.dispatch(new rootActions.StartValidation());
  }
}
