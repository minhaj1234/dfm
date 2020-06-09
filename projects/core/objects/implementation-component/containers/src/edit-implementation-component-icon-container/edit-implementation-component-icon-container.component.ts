import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from 'core/objects/implementation-component/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditImplementationComponentIconState } from './implementation-component-icons-container.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-edit-implementation-component-icon-container',
  styleUrls: ['./edit-implementation-component-icon-container.component.scss'],
  templateUrl: './edit-implementation-component-icon-container.component.html',
})
export class EditImplementationComponentIconContainerComponent implements OnInit, OnDestroy {
  state$: Observable<EditImplementationComponentIconState>;
  @Input() iconId: string;

  constructor(private store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>) { }

  ngOnInit() {
    this.subscribeEditImplementationComponentIconState();
  }

  subscribeEditImplementationComponentIconState(): void {
    this.state$ = combineLatest([
      this.store.select(fromStore.getSelectedImplementationComponentIcon(this.iconId)),
    ]).pipe(
      untilDestroyed(this),
      map(([icon]) => {
        return { icon };
      })
    );
  }

  ngOnDestroy() { }
}
