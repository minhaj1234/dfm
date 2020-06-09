import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { ObjectRelationsNames } from '../models/objects.model';
import { System } from '../models/system.model';
import { toSystem } from '../utilitites/mappings';

@Injectable()
export class SystemsService extends CommonService<System> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(System, ObjectRelationsNames.Systems, externalService, injector);
    this.toObject = toSystem;
    this.pageSize = Config.pageSize;
  }
}
