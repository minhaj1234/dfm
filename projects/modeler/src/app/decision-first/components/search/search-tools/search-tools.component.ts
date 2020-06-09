import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-search-tools',
  templateUrl: './search-tools.component.html',
  styleUrls: ['./search-tools.component.scss'],
})
export class SearchToolsComponent {}
