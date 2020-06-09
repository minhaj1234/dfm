import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Config } from '../../config';
import { Event } from '../models/events.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toEvent } from '../utilitites/mappings';

@Injectable()
export class EventsService extends CommonService<Event> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(Event, ObjectRelationsNames.Events, externalService, injector);
    this.toObject = toEvent;
    this.pageSize = Config.pageSize;
  }
}
