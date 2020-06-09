import { Routes } from '@angular/router';
import { AuthenticatedGuardService } from 'core/auth';
import { CallbackComponent, LoggedOutComponent, LoginContainerComponent, NotFoundComponent } from 'core/containers';

export const ROUTES: Routes = [
  {
    canActivate: [AuthenticatedGuardService],
    loadChildren: './decision-first/decisionFirst.module#DecisionFirstModule',
    path: 'decision-first',
  },
  { path: '', pathMatch: 'full', redirectTo: 'decision-first' },
  { path: 'callback', component: CallbackComponent },
  { path: 'loggedOut', component: LoggedOutComponent },
  { path: 'login', component: LoginContainerComponent, data : { displayVersionInformation : true }},
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
