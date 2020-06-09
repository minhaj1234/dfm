import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import * as fromModelerStore from '../../store';
import { Config } from '../../../config';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-header-container',
  styleUrls: ['./header-container.component.scss'],
  templateUrl: './header-container.component.html',
})
export class HeaderContainerComponent {

  environmentName: string = Config.environmentName;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
  ) { }

  sidebarToggle(): void {
    this.modelerStore.select(fromModelerStore.getIsPinnedPropertySidebar)
      .pipe(take(1))
      .subscribe((isPinned: boolean) => {
        if (isPinned) {
          this.modelerStore.dispatch(new fromModelerStore.SetIsPinnedPropertySidebar(false));
        }
        this.modelerStore.dispatch(new fromModelerStore.ToggleSidebar());
      });
  }
}
