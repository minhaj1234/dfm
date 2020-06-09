import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import * as fromStore from 'core/objects/implementation-component/store';
import * as fromTabStore from 'core/objects/tabs/store';
import { getSvgBase64String } from 'core/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-implementation-component-icon-table',
  styleUrls: ['./implementation-component-icon-table.component.scss'],
  templateUrl: './implementation-component-icon-table.component.html',
})
export class ImplementationComponentIconTableComponent {
  @Input() icons: ImplementationComponentIcon[];

  constructor(
    private domSanitizer: DomSanitizer, 
    private store: Store<fromStore.DecisionFirstImplementationComponentsIconsState>
  ) { }

  transformToSafeSvgResourceUrl(iconBase64: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(getSvgBase64String(iconBase64));
  }

  deleteIcon(id: string): void {
    this.store.dispatch(new fromStore.DeleteImplementationComponentsIcon(id));
  }

  trackByFn(index: number, icon: ImplementationComponentIcon): string {
    return icon.id;
  }

  openIconTab(icon: ImplementationComponentIcon): void {
    this.store.dispatch(
      new fromTabStore.AddTab({
        id: icon.id,
        type: ObjectTabType.ImplementationComponentIcon,
      }),
    );
  }

  canDeleteIcon(icon: ImplementationComponentIcon): boolean {
    return !icon.isDefault;
  }
}
