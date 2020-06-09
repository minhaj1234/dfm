import { HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { CommonService } from 'core/services';
import { Observable } from 'rxjs';
import { Config } from '../../config';
import { Diagram } from '../models/diagram.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { toDiagram } from '../utilitites/mappings';

@Injectable()
export class DiagramsService extends CommonService<Diagram> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(Diagram, ObjectRelationsNames.Diagrams, externalService, injector);
    this.toObject = toDiagram;
    this.pageSize = Config.pageSize;
  }

  removeLink(diagramHref: string, fromObjectId: string, toObjectId: string, linkType: string, headers?: HttpHeaders): Observable<Object> {
    return this.externalService.getHttp().delete(`${diagramHref}/${fromObjectId}/${linkType}/${toObjectId}`, {
      headers: headers
    });
  }

  removeObject(sourceObjectRelatedHref: string, relatedObjectId: string, isPermanentDelete: boolean, headers?: HttpHeaders): Observable<Object> {
    return this.externalService.getHttp().delete(`${sourceObjectRelatedHref}/${relatedObjectId}?isDeletePermanently=${isPermanentDelete}`, {
      headers: headers
    });
  }

  isObjectAssociatedWithOtherDiagram(diagramId: string, objectType: string, objectId: string): Observable<object> {
    return this.externalService.getHttp().get(`${Config.rootUri}diagrams/${diagramId}/${objectType}/${objectId}`);
  }
}
