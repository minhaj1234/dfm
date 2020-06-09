export interface ISocketMessage {
  eventType: eventType;
  resourceId: string;
  linkData?: string[];
  userId?: string;
  relatedEntityType?: string;
}

export type eventType = 'create' | 'delete' | 'update' | 'linkUpdate' | 'linkDelete';
