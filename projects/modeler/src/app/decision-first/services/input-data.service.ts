import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { InputData } from '../models/inputData.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toInputData } from '../utilitites/mappings';

@Injectable()
export class InputDatasService extends CommonService<InputData> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(InputData, ObjectRelationsNames.InputDatas, externalService, injector);
    this.toObject = toInputData;
    this.pageSize = Config.pageSize;
  }
}
