import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SidebarPanel } from 'core/objects/sidebar/models';
import { Observable } from 'rxjs';
import { IDecisionFirstState } from '../../store';
import * as fromStore from '../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-nav-bar-container',
  styleUrls: ['./nav-bar-container.component.scss'],
  templateUrl: './nav-bar-container.component.html',
})
export class NavBarContainerComponent implements OnInit, OnDestroy {
  SidebarPanel = SidebarPanel;
  currentSidebarPanel$: Observable<SidebarPanel>;

  constructor(
    private store: Store<IDecisionFirstState>,
  ) { }

  ngOnInit() {
    this.currentSidebarPanel$ = this.store.pipe(select(fromStore.getCurrentPanelSidebar));
  }

  ngOnDestroy() { }
}
