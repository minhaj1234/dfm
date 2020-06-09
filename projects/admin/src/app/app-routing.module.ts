import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent, LoggedOutComponent, LoginContainerComponent, NotFoundComponent } from 'core/containers';
import { AdminAuthenticatedGuardService } from './decision-first/auth/admin-authenticated-guard.service';

const routes: Routes = [
  {
    canActivate: [AdminAuthenticatedGuardService],
    loadChildren: './decision-first/decisionFirst.module#DecisionFirstModule',
    path: 'decision-first',
  },
  { path: '', pathMatch: 'full', redirectTo: 'decision-first' },
  { path: 'callback', component: CallbackComponent },
  { path: 'loggedOut', component: LoggedOutComponent },
  { path: 'login', component: LoginContainerComponent, data : { displayVersionInformation : false }},
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
