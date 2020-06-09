import { Injectable } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { IResultsWithPages } from 'core/models';
import { getPagination } from 'core/utilities';
import { compose, prop, sortBy, toLower } from 'ramda';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from '../../config';
import { Graphable } from '../models/graphable.model';
import { ObjectClassNames, ObjectRelationsNames } from '../models/objects.model';
import { toDecision, toInputData, toKnowledgeSource } from '../utilitites/mappings';


@Injectable({
  providedIn: 'root',
})
export class DiagrammingElementsService {
  private _resource: string;
  constructor(private externalService: ExternalService) {
    this._resource = 'repository';
  }

  getSomeMinimalWithSearch(searchTerm = ''): Observable<IResultsWithPages<Graphable>> {
    const types = [
      ObjectClassNames.Decision,
      ObjectClassNames.InputData,
      ObjectClassNames.KnowledgeSource
    ];
    const uriEncodedSearchTerm = encodeURIComponent(searchTerm);
    const url =
      `${this.externalService.getURL()}${this._resource}/search/findObjectsInSearchLists` +
      `?partialName=${uriEncodedSearchTerm}&partialDescription=${uriEncodedSearchTerm}&size=${Config.pageSize}&types=${types.toString()}&excludeIds=&sort=name`;
    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map(assembleResults));
  }

  getMissingForNode(nodeId: string, diagramId: string): Observable<IResultsWithPages<Graphable>> {
    const url = `${this.externalService.getURL()}diagrams/${diagramId}/${nodeId}`;
    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map((result: any) => <IResultsWithPages<Graphable>>{
        pagination: {
          number: 0,
          size: result._embedded ? result._embedded.objects.length : 0,
          totalElements: result._embedded ? result._embedded.objects.length : 0,
          totalPages: 1
        },
        results: (result._embedded ? result._embedded.objects as Graphable[] : [])
          .map(obj => {
            switch (obj.type) {
              case ObjectRelationsNames.Decisions:
                return toDecision(obj);
              case ObjectRelationsNames.InputDatas:
                return toInputData(obj);
              case ObjectRelationsNames.KnowledgeSources:
                return toKnowledgeSource(obj);
            }
          })
          .filter(obj => obj)
      }));
  }

  getByUrl(url: string): Observable<IResultsWithPages<Graphable>> {
    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map(assembleResults));
  }
}

export function assembleResults(objs: any): IResultsWithPages<Graphable> {
  const pagination = getPagination(objs);
  const results = [];

  if (objs._embedded)
    objs._embedded.objects.forEach((sourceObject) => {
      switch (sourceObject.type) {
        case ObjectRelationsNames.Decisions:
          results.push(toDecision(sourceObject));
          break;
        case ObjectRelationsNames.InputDatas:
          results.push(toInputData(sourceObject));
          break;
        case ObjectRelationsNames.KnowledgeSources:
          results.push(toKnowledgeSource(sourceObject));
          break;
      }
    });

  return {
    pagination,
    results,
  };
}
