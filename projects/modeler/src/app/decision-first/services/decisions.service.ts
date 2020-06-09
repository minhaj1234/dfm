import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { Decision } from '../models/decision.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toDecision } from '../utilitites/mappings';

@Injectable()
export class DecisionsService extends CommonService<Decision> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(Decision, ObjectRelationsNames.Decisions, externalService, injector);
    this.toObject = toDecision;
    this.pageSize = Config.pageSize;
  }
}
