import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { IResultsWithPages } from 'core/models';
import { getPagination } from 'core/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from '../../config';
import { Graphable } from '../models/graphable.model';
import { ObjectRelationsNames } from '../models/objects.model';
import { allSearchFilterTypeObjects, Search, SearchSort } from '../models/search.model';
import {
  toBusinessObjective,
  toDecision,
  toDiagram,
  toEvent,
  toImplementationComponent,
  toInputData,
  toKnowledgeSource,
  toOrganization,
  toProcess,
  toSystem,
  toTag,
} from '../utilitites/mappings';

@Injectable({
  providedIn: 'root',
})
export class RepositoryService {
  private _resource: string;
  constructor(private externalService: ExternalService, injector: Injector) {
    this._resource = 'repository';
  }

  getSomeMinimalWithSearch(
    searchTerm = '',
    types = allSearchFilterTypeObjects,
    sort = SearchSort.Asc,
    excludeIds = '',
    pageSize = Config.pageSize,
    fullMatchOnly = true,
  ): Observable<IResultsWithPages<Search>> {
    types = types.length === 0 ? allSearchFilterTypeObjects : types;
    const uriEncodedSearchTerm = encodeURIComponent(searchTerm);

    const url =
      `${this.externalService.getURL()}${this._resource}/search/findObjectsInSearchLists` +
      `?partialName=${uriEncodedSearchTerm}&partialDescription=${uriEncodedSearchTerm}&size=${pageSize}&types=${types.toString()}&sort=name,${sort}` +
      `&excludeIds=${excludeIds}&fullMatchOnly=${fullMatchOnly}`;

    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map(assembleResults));
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
        case ObjectRelationsNames.Diagrams:
          results.push(toDiagram(sourceObject));
          break;
        case ObjectRelationsNames.Decisions:
          results.push(toDecision(sourceObject));
          break;
        case ObjectRelationsNames.InputDatas:
          results.push(toInputData(sourceObject));
          break;
        case ObjectRelationsNames.KnowledgeSources:
          results.push(toKnowledgeSource(sourceObject));
          break;
        case ObjectRelationsNames.Organizations:
          results.push(toOrganization(sourceObject));
          break;
        case ObjectRelationsNames.BusinessObjectives:
          results.push(toBusinessObjective(sourceObject));
          break;
        case ObjectRelationsNames.Processes:
          results.push(toProcess(sourceObject));
          break;
        case ObjectRelationsNames.Events:
          results.push(toEvent(sourceObject));
          break;
        case ObjectRelationsNames.Systems:
          results.push(toSystem(sourceObject));
          break;
        case ObjectRelationsNames.ImplementationComponents:
          results.push(toImplementationComponent(sourceObject));
          break;
        case ObjectRelationsNames.Tags:
          results.push(toTag(sourceObject));
          break;
      }
    });

  return {
    pagination,
    results,
  };
}
