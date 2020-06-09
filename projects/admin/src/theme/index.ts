import { NgModule } from '@angular/core';
import { NbCardModule, NbDialogModule, NbLayoutModule, NbListModule, NbSidebarModule, NbSidebarService, NbToastrModule } from '@nebular/theme';
import { ContextMenuModule } from 'ngx-contextmenu';

@NgModule({
  imports: [
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    NbCardModule,
    NbLayoutModule,
    NbSidebarModule,
    NbDialogModule.forRoot({autoFocus: false}),
    NbListModule,
    NbToastrModule.forRoot(),
  ],
  exports: [
    ContextMenuModule,
    NbCardModule,
    NbLayoutModule,
    NbSidebarModule,
    NbDialogModule,
    NbListModule,
    NbToastrModule,
  ],
  providers: [
    NbSidebarService,
  ]
})
export class AdminThemeModule {}
