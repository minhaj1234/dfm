import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BusinessObjective } from '../../../../models/businessObjective.model';
import { Decision, DecisionStatusLevel, DecisionType } from '../../../../models/decision.model';
import { Diagram } from '../../../../models/diagram.model';
import { Graphable } from '../../../../models/graphable.model';
import { InputDataType } from '../../../../models/inputData.model';
import { KnowledgeSourceType } from '../../../../models/knowledgeSource.model';
import { DfmObjects, ObjectClassNames } from '../../../../models/objects.model';
import { Organization } from '../../../../models/organization.model';

const OBJECT_PRINT_VALUES = {
  [InputDataType.UNSTRUCTURED]: 'Unstructured',
  [InputDataType.STRUCTURED]: 'Structured',
  [InputDataType.SEMISTRUCTURED]: 'Semi-structured',
  [DecisionType.STRATEGIC]: 'Strategic',
  [DecisionType.TACTICAL]: 'Tactical',
  [DecisionType.OPERATIONAL]: 'Operational',
  [KnowledgeSourceType.REGULATION]: 'Regulation',
  [KnowledgeSourceType.POLICY]: 'Policy',
  [KnowledgeSourceType.ANALYTIC]: 'Analytic',
  [DecisionStatusLevel.INPROCESS]: 'In process',
  [DecisionStatusLevel.COMPLETED]: 'Completed',
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-print-object',
  styleUrls: ['./print-object.component.scss'],
  templateUrl: './print-object.component.html',
})
export class PrintObjectComponent {
  _object: DfmObjects;
  @Input() includeRelatedObjects: boolean;
  @Input() includeComments: boolean;
  @Input() topLevelHeading = true;
  @Input() set object(object: DfmObjects) {
    if (object) {
      this._object = object;
    }
  };
  get object(): DfmObjects {
    return this._object;
  }

  isDecision(): boolean {
    return this.object.className === ObjectClassNames.Decision;
  }

  isInputData(): boolean {
    return this.object.className === ObjectClassNames.InputData;
  }
  
  isKnowledgeSource(): boolean {
    return this.object.className === ObjectClassNames.KnowledgeSource;
  }

  isOrganization(): boolean {
    return this.object.className === ObjectClassNames.Organization;
  }

  isBusinessObjective(): boolean {
    return this.object.className === ObjectClassNames.BusinessObjective;
  }

  isImplementationComponent(): boolean {
    return this.object.className === ObjectClassNames.ImplementationComponent;
  }

  isProcess(): boolean {
    return this.object.className === ObjectClassNames.Process;
  }

  isSystem(): boolean {
    return this.object.className === ObjectClassNames.System;
  }

  isEvent(): boolean {
    return this.object.className === ObjectClassNames.Event;
  }

  getPrimaryDiagram(object: Graphable): Diagram {
    return object.diagrams && object.diagrams.find((diagram) => diagram.id === object.primaryDiagramId);
  }

  doDisplayRelatedObjects(objects: DfmObjects[]): boolean {
    return !!objects && !!objects.length;
  }

  doDisplayOrganizationContext(object: Decision): boolean {
    return this.doDisplayRelatedObjects(object.organizationsImpactedByDecisions) 
      || this.doDisplayRelatedObjects(object.organizationsMakesDecisions)
      || this.doDisplayRelatedObjects(object.organizationsOwnsDecisions);
  }

  doDisplayApplicationContext(object: Decision): boolean {
    return this.doDisplayRelatedObjects(object.businessObjectives) 
      || this.doDisplayRelatedObjects(object.events) 
      || this.doDisplayRelatedObjects(object.systems) 
      || this.doDisplayRelatedObjects(object.processes);
  }
  
  doDisplayBusinessImpact(object: BusinessObjective): boolean {
    return this.doDisplayRelatedObjects(object.decisions) 
    || this.doDisplayRelatedObjects(object.organizations);
  }

  doDisplayDecisionsInvolved(object: Organization): boolean {
    return this.doDisplayRelatedObjects(object.ownsDecisions) 
      || this.doDisplayRelatedObjects(object.makesDecisions)
      || this.doDisplayRelatedObjects(object.impactedByDecisions);
  }

  doDisplayOrganizationStructure(object: Organization): boolean {
    return !!object
      && (!!object.parentOrganization || this.doDisplayRelatedObjects(object.childOrganizations));
  }

  doDisplayOwnsOrganization(object: Organization): boolean {
    return this.doDisplayRelatedObjects(object.knowledgeSources) 
      || this.doDisplayRelatedObjects(object.inputDatas);
  }

  doDisplayObjectivesInvolved(object: Organization): boolean {
    return this.doDisplayRelatedObjects(object.businessObjectives);
  }

  convertObjectValue(type: string): string {
    return OBJECT_PRINT_VALUES[type];
  }
}
