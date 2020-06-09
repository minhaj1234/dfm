import { HeaderContainerComponent } from './header-container/header-container.component';
import { HomeContainerComponent } from './home-container/home-container.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { NavBarContainerComponent } from './nav-bar-container/nav-bar-container.component';
import { TabsComponent } from './tabs/tabs.component';

export const containers: any[] = [
  MainContainerComponent,
  HeaderContainerComponent,
  NavBarContainerComponent,
  TabsComponent,
  HomeContainerComponent,
];

export * from './main-container/main-container.component';
export * from './header-container/header-container.component';
export * from './nav-bar-container/nav-bar-container.component';
export * from './tabs/tabs.component';
export * from './home-container/home-container.component';
