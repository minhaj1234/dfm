import { Resource } from 'angular4-hal';
import { CommonAdminService } from './common-admin.service';

export interface RelatedServiceFactories {[key: string] : () => CommonAdminService<Resource>};