import { ResourceWithId } from 'core/models';
import { Comment } from './comment.model';
import { Decision } from './decision.model';
import { Diagram } from './diagram.model';
import { KnowledgeSource } from './knowledgeSource.model';
import { ObjectClassNames } from './objects.model';
import { Organization } from './organization.model';
import { ObjectTagsUpdate, Tag } from './tag.model';

export class InputData extends ResourceWithId {
  readonly className: string = ObjectClassNames.InputData;
  id: string;
  name: string;
  description: string;
  type: string;
  url: string;
  complexity: string;
  primaryDiagramId: string;
  tags: Tag[];
  diagrams: Diagram[];
  organizations: Organization[];
  requiredByDecisions: Decision[];
  requiredByKnowledgeSources: KnowledgeSource[];
  comments: Comment[];
  _links: IInputDataLinks;
}

export interface IInputDataLinks {
  self: {
    href: string;
  };
  inputData?: {
    href: string;
  };
  organizations?: {
    href: string;
  };
  requiredByKnowledgeSources?: {
    href: string;
  };
  diagrams?: {
    href: string;
  };
  requiredByDecisions?: {
    href: string;
  };
};

export enum InputDataType {
  UNSTRUCTURED = 'UNSTRUCTURED',
  STRUCTURED = 'STRUCTURED',
  SEMISTRUCTURED = 'SEMI_STRUCTURED'
}

export const defaultInputDataType = InputDataType.UNSTRUCTURED;

export class IStateEditInputData {
  inputData: InputData;
  isReadOnlySession: boolean;
}

export type InputDataRelatedObjects = 
  | Diagram
  | Organization 
  | KnowledgeSource 
  | Decision
  | Comment;

export interface IInputDataUpdate {
  inputData: Partial<InputData> ;
  objectTagsUpdate?: ObjectTagsUpdate;
}
