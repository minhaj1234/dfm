import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from '../../config';
import { ImplementationComponent } from '../models/implementationComponent.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toImplementationComponent } from '../utilitites/mappings';

@Injectable()
export class ImplementationComponentsService extends CommonService<ImplementationComponent> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(ImplementationComponent, ObjectRelationsNames.ImplementationComponents, externalService, injector);
    this.toObject = toImplementationComponent;
    this.pageSize = Config.pageSize;
  }
}
