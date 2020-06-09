import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromStore from 'core/objects/implementation-component/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImplementationComponentIconsState } from './implementation-component-icons-container.const';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-implementation-component-icons-container',
  styleUrls: ['./implementation-component-icons-container.component.scss'],
  templateUrl: './implementation-component-icons-container.component.html',
})
export class ImplementationComponentIconsContainerComponent implements OnInit, OnDestroy {
  state$: Observable<ImplementationComponentIconsState>;

  constructor(private store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>) { }

  ngOnInit() {
    this.store.dispatch(new fromStore.LoadImplementationComponentsIcons());

    this.subscribeImplementationComponentIconsState();
  }

  subscribeImplementationComponentIconsState(): void {
    this.state$ = combineLatest([
      this.store.select(fromStore.getImplementationComponentsIconsAsArray),
      this.store.select(fromStore.getDisplayUploadImplementationComponentIconForm),
    ]).pipe(
      untilDestroyed(this),
      map(([icons, displayForm]) => {
        return { icons, displayForm };
      })
    );
  }

  ngOnDestroy() { }
}
