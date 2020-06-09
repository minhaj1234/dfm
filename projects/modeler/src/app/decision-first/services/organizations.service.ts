import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { ObjectRelationsNames } from '../models/objects.model';
import { Organization } from '../models/organization.model';
import { toOrganization } from '../utilitites/mappings';

@Injectable()
export class OrganizationsService extends CommonService<Organization> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(Organization, ObjectRelationsNames.Organizations, externalService, injector);
    this.toObject = toOrganization;
    this.pageSize = Config.pageSize;
  }
}
