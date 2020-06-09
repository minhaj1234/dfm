import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticatedUser, ITab, ObjectTabType, PRINT_TAB_ID_TYPE_SEPARATOR, TechnicalTabType } from 'core/models';
import { IStateNavigationSidebar, SidebarPanel } from 'core/objects/sidebar/models';
import { rootActions, rootReducers, rootSelectors } from 'core/root-store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrintableObjectsTypes } from '../../../models/objects.model';
import * as fromModelerStore from '../../../store';
import { getCurrentTabEntity } from '../../../store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-navigation-sidebar',
  templateUrl: './navigation-sidebar.component.html',
  styleUrls: ['./navigation-sidebar.component.scss']
})
export class NavigationSidebarComponent implements OnInit, OnDestroy {
  currentLanguageCode: string;
  state$: Observable<IStateNavigationSidebar>;
  isReadOnlySession$: Observable<boolean>;
  currentTab: ITab;

  constructor(
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private rootStore: Store<rootReducers.IState>,
    private translateService: TranslateService,
    private changeDetectorRef:  ChangeDetectorRef,
  ) {
    this.isReadOnlySession$ = this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession));
  }

  ngOnInit() {
    this.getStateForNavigationSidebar();
    this.getCurrentLanguage();
    this.subscribeGetSelectedTab();
  }

  getStateForNavigationSidebar(): void {
    this.state$ = combineLatest([
      this.rootStore.pipe(select(rootSelectors.getIsReadOnlySession)),
      this.modelerStore.pipe(select(fromModelerStore.getIsPinnedPropertySidebar)),
      this.modelerStore.pipe(select(rootSelectors.getAuthenticatedUser)),
    ]).pipe(
      map(([isReadOnlySession, isPinnedProperty, authenticatedUser]) => {
        return { isReadOnlySession, isPinnedProperty, authenticatedUser }
      })
    );
  }

  getCurrentLanguage(): void {
    const languageCode = localStorage.getItem('languageCode');
    this.currentLanguageCode = languageCode ? languageCode : this.translateService.getDefaultLang();
  }

  subscribeGetSelectedTab(): void {
    this.modelerStore.pipe(      
      untilDestroyed(this),
      select(getCurrentTabEntity),
    ).subscribe((currentTab) => {
      this.currentTab = currentTab;
      this.changeDetectorRef.detectChanges();
    });
  }

  isPrintableObject(): boolean {
    return this.currentTab && PrintableObjectsTypes[this.currentTab.type];
  }

  openAddObjectSidebarPanel(): void {
    this.modelerStore.dispatch(new fromModelerStore.SetCurrentSidebarPanel(SidebarPanel.AddObjects));
  }

  openExistingObjectsSidebarPanel(): void {
    this.modelerStore.dispatch(new fromModelerStore.SetCurrentSidebarPanel(SidebarPanel.ExistingObjects));
  }

  changeLanguage($event): void {
    localStorage.setItem('languageCode', $event.target.value);
    this.translateService.use($event.target.value);
  }

  openAdminTab(): void {
    this.modelerStore.dispatch(
      new fromModelerStore.AddTab({
        type: TechnicalTabType.Admin,
      }),
    );
  }

  openPrintTab(): void {
    this.modelerStore.dispatch(
      new fromModelerStore.AddTab({
        type: TechnicalTabType.Print,
        id: `${this.currentTab.type}${PRINT_TAB_ID_TYPE_SEPARATOR}${this.currentTab.id}`,
      }),
    );
  }

  logOut(): void {
    this.modelerStore.dispatch(new rootActions.Logout());
    this.modelerStore.dispatch(new fromModelerStore.CollapseSidebar());
  }

  changeIsPinnedProperty(value: boolean): void {
    this.modelerStore.dispatch(new fromModelerStore.SetIsPinnedPropertySidebar(value));
  }

  changeIsReadOnlySession(value: boolean): void {
    this.rootStore.dispatch(new rootActions.SetIsReadOnlySession(value));
  }

  openProfileTab(authenticatedUser: AuthenticatedUser): void {
    this.modelerStore.dispatch(
      new fromModelerStore.AddTab({
        type: ObjectTabType.User,
        id: authenticatedUser.userId
      }),
    );
  }

  ngOnDestroy() { }
}
