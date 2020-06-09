import { ResourceWithId } from 'core/models';

export class ImplementationComponentIcon extends ResourceWithId {
  readonly className: string = IMPLEMENTATION_COMPONENT_ICON_OBJECT_NAME;
  id: string;
  name: string;
  tooltip: string;
  base64: string;
  isDefault: boolean;
}

export interface UploadImplementationComponentIconRequest {
  name: string;
  tooltip: string;
  icon: File;
}

export const IMPLEMENTATION_COMPONENT_ICON_OBJECT_NAME = 'ImplementationComponentIcon';

export const IMPLEMENTATION_COMPONENT_ICON_RELATION_NAME = 'icons';
