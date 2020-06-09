import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getI18nString } from 'core/utilities';
import { ObjectRelationsNames } from '../../../models/objects.model';
import { Tag } from '../../../models/tag.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-tag-associated-objects-display',
  templateUrl: './tag-associated-objects-display.component.html',
  styleUrls: ['./tag-associated-objects-display.component.scss']
})
export class TagAssociatedObjectsDisplayComponent {
  tagRelationObjectPaths = [
    ObjectRelationsNames.Diagrams,
    ObjectRelationsNames.Decisions,
    ObjectRelationsNames.InputDatas,
    ObjectRelationsNames.KnowledgeSources,
    ObjectRelationsNames.Organizations,
    ObjectRelationsNames.BusinessObjectives,
    ObjectRelationsNames.Processes,
    ObjectRelationsNames.Events,
    ObjectRelationsNames.Systems,
    ObjectRelationsNames.ImplementationComponents,
  ];
  geti18nObjectRelationName = getI18nString;
  @Input() tag: Tag;

  constructor() { }
}
