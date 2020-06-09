import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { ObjectRelationsNames } from '../models/objects.model';
import { Process } from '../models/process.model';
import { toProcess } from '../utilitites/mappings';

@Injectable()
export class ProcessesService extends CommonService<Process> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(Process, ObjectRelationsNames.Processes, externalService, injector);
    this.toObject = toProcess;
    this.pageSize = Config.pageSize;
  }
}
