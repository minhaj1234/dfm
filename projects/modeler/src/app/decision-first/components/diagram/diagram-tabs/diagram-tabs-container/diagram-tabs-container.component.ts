import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList } from '@angular/core';
import { DiagramSidebarTabTypes } from '../../../../models/goJsDiagram.model';
import { DiagramTabComponent } from '../diagram-tab/diagram-tab.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-diagram-tabs-container',
  templateUrl: './diagram-tabs-container.component.html',
  styleUrls: ['./diagram-tabs-container.component.scss'],
})
export class DiagramTabsContainerComponent implements OnInit, OnDestroy {
  @ContentChildren(DiagramTabComponent) tabs: QueryList<DiagramTabComponent>;
  @Output() selectTab = new EventEmitter<DiagramSidebarTabTypes>();
  @Input() selectedTabType: DiagramSidebarTabTypes;

  get selectedTab(): DiagramTabComponent {
    return this.tabs.find((tab) => tab.needDisplay(this.selectedTabType));
  }

  ngOnInit() { }

  doTabDisplay(tab: DiagramTabComponent): boolean {
    return tab.needDisplay(this.selectedTabType);
  }

  onTabClicked(tab: DiagramTabComponent): void {
    this.selectTab.emit(this.getSelectedTabType(tab));
  }

  getSelectedTabType(tab: DiagramTabComponent): DiagramSidebarTabTypes {
    return !tab.needDisplay(this.selectedTabType) ? tab.type : null;
  }

  ngOnDestroy() { }
}
