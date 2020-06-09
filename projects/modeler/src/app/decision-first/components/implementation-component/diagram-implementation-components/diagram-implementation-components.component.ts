import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ObjectTabType } from 'core/models';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { getSvgBase64String, getUrlWithProtocol, isCorrectUrl } from 'core/utilities';
import { ImplementationComponent } from '../../../models/implementationComponent.model';
import * as fromStore from '../../../store/';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-diagram-implementation-components',
  templateUrl: './diagram-implementation-components.component.html',
  styleUrls: ['./diagram-implementation-components.component.scss'],
})
export class DiagramImplementationComponentsComponent {
  @Input() implementationComponents: ImplementationComponent[];
  @Input() icons: ImplementationComponentIcon[];

  constructor(
    private store: Store<fromStore.IDecisionFirstState>,
    private domSanitizer: DomSanitizer,
  ) {}

  openTabImplementationComponent(id: string): void {
    this.store.dispatch(
      new fromStore.AddTab({
        id: id,
        type: ObjectTabType.ImplementationComponent,
      }),
    );
  }

  openUrlImplementationComponent(url: string): void {
    if (isCorrectUrl(url)) {
      window.open(getUrlWithProtocol(url), '_blank');
    }
  }

  transformToSafeSvgResourceUrl(implementationComponent: ImplementationComponent): SafeResourceUrl {
    const icon = this.icons.find((item) => item.id === implementationComponent.iconId);
    
    return this.domSanitizer.bypassSecurityTrustResourceUrl(getSvgBase64String(icon ? icon.base64 : ''));
  }
}
