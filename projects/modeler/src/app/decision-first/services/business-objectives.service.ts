import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { BusinessObjective } from '../models/businessObjective.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toBusinessObjective } from '../utilitites/mappings';

@Injectable()
export class BusinessObjectivesService extends CommonService<BusinessObjective> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(BusinessObjective, ObjectRelationsNames.BusinessObjectives, externalService, injector);
    this.toObject = toBusinessObjective;
    this.pageSize = Config.pageSize;
  }
}
