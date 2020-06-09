import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { Diagram } from './diagram.model';
import { InputData } from './inputData.model';
import { ObjectClassNames } from './objects.model';
import { Organization } from './organization.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class KnowledgeSource extends ResourceWithId {
  readonly className: string = ObjectClassNames.KnowledgeSource;
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  complexity: string;
  primaryDiagramId: string;
  tags: Tag[];
  diagrams: Diagram[];
  requiresDecisions: Decision[];
  requiredByDecisions: Decision[];
  requiresInputData: InputData[];
  requiresKnowledgeSources: KnowledgeSource[];
  requiredByKnowledgeSources: KnowledgeSource[];
  organizations: Organization[];
  comments: Comment[];
  _links: IKnowledgeSourceLinks;
}

export interface IKnowledgeSourceLinks {
  self: {
    href: string;
  };
  knowledgeSource?: {
    href: string;
  };
  diagrams?: {
    href: string;
  };
  requiresDecisions?: {
    href: string;
  };
  organizations?: {
    href: string;
  };
  requiredByKnowledgeSources?: {
    href: string;
  };
  requiresKnowledgeSources?: {
    href: string;
  };
  requiredByDecisions?: {
    href: string;
  };
  requiresInputData?: {
    href: string;
  };
  organization?: {
    href: string;
  };
};

export enum KnowledgeSourceType {
  REGULATION = 'REGULATION',
  POLICY = 'POLICY',
  ANALYTIC = 'ANALYTIC'
}

export const defaultKnowledgeSourceType = KnowledgeSourceType.REGULATION;

export class IStateEditKnowledgeSource {
  knowledgeSource: KnowledgeSource;
  isReadOnlySession: boolean;
}

export type KnowledgeSourceRelatedObjects =
  | Diagram
  | Decision
  | InputData
  | KnowledgeSource
  | Organization
  | Comment;

export interface IKnowledgeSourceUpdate {
  knowledgeSource: Partial<KnowledgeSource>;
  objectTagsUpdate?: ObjectTagsUpdate;
}