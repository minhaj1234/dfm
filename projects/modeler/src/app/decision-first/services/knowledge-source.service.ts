import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { KnowledgeSource } from '../models/knowledgeSource.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toKnowledgeSource } from '../utilitites/mappings';

@Injectable()
export class KnowledgeSourceService extends CommonService<KnowledgeSource> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(KnowledgeSource, ObjectRelationsNames.KnowledgeSources, externalService, injector);
    this.toObject = toKnowledgeSource;
    this.pageSize = Config.pageSize;
  }
}
