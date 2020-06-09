import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Config } from '../../../config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'admin-header-container',
  styleUrls: ['./header-container.component.scss'],
  templateUrl: './header-container.component.html',
})
export class HeaderContainerComponent {

  environmentName: string = Config.environmentName;
  
  constructor(
    private sidebarService: NbSidebarService,
  ) { }

  sidebarToggle() {
    this.sidebarService.toggle(false, 'sidebar');
  }
}
