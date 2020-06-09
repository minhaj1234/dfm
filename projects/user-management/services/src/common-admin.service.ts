import { Injector } from '@angular/core';
import { ExternalService, Resource } from 'angular4-hal';
import { IResultsWithPages } from 'core/models';
import { CommonService } from 'core/services';
import { getPagination } from 'core/utilities';
import { forkJoin, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserManagementObject, USER_MANAGEMENT_LINKS_ARRAY } from 'user-management/models';
import { RelatedServiceFactories } from './common-admin.types';

export class CommonAdminService<T extends Resource> extends CommonService<T> {
  constructor(
    protected resourceInfo: UserManagementObject,
    protected externalService: ExternalService,
    injector: Injector,
    private relatedServiceFactories: RelatedServiceFactories
  ) {
    super(<new () => T>resourceInfo.type, `administration/${resourceInfo.resourceName}`, externalService, injector);
  }

  toPageableObject(objs: any): IResultsWithPages<T> {
    const pagination = getPagination(objs);
    const results = [...(objs._embedded ? objs._embedded[this.resourceInfo.listName] || [] : []).map(this.toObject)];
    return {
      pagination,
      results,
    };
  }

  withRelatedObjects(source: T, specificKeys: string[] = null): Observable<T> {
    const relatedObjectsRequests = this.requestRelatedObjects(source[USER_MANAGEMENT_LINKS_ARRAY], specificKeys);

    if (!(relatedObjectsRequests.length > 0)) {
      return of(source);
    }

    return forkJoin(relatedObjectsRequests).pipe(
      map((relatedObjects) => {
        const relatedObjectsObject = relatedObjects.reduce((previous, next) => ({ ...previous, ...next }), {})
        return {
          ...source,
          ...relatedObjectsObject
        };
      })
    );
  }

  withRelatedObject(source: T, className: string): Observable<T> {
    return this.withRelatedObjects(source, [className]);
  }

  private requestRelatedObjects(linksArray: any, specificKeys: string[] = null): Observable<{ [resourceName: string]: Resource[] | Resource }>[] {
    const relatedObjectsRequests: Observable<{ [resourceName: string]: Resource[] | Resource }>[] = [];
    Object.keys(linksArray)
      .filter(relationKey => (!specificKeys || specificKeys.includes(relationKey)))
      .forEach(relationKey => {
        const factory = this.relatedServiceFactories[relationKey];
        const service = factory ? <CommonAdminService<Resource>>factory() : null;
        if (!service) {
          return;
        }

        const link = linksArray[relationKey].href.replace('{?projection}', '?projection=edit');

        relatedObjectsRequests.push(service
          .getBySelfLink(link)
          .pipe(
            map((response: any) => this.extractRelatedObjects(response, service)),
            map((collection: Resource[] | Resource) => ({ [relationKey]: collection }))
          )
        );
      });

    return relatedObjectsRequests;
  }

  private extractRelatedObjects(responseObj: any, service: CommonAdminService<Resource>): Resource[] | Resource {
    if (!responseObj._embedded) {
      return responseObj.id ? service.toObject(responseObj) : [];
    }

    return [...(responseObj._embedded[service.resourceInfo.listName] || []).map(service.toObject)]
  }

  getSomeMinimalWithSearch(searchTerm = '', pageNumber = 0, accountId = ''): Observable<IResultsWithPages<T>> {
    return this.externalService.getHttp()
      .get(`${this.externalService.getURL()}administration/${this.resourceInfo.resourceName}/${this.resourceInfo.partialSearchPath}` +
        `?${this.resourceInfo.accountIdParameterName}=${accountId}&${this.resourceInfo.partialSearchParameterName}=${searchTerm}&page=${pageNumber}&size=${this.pageSize}` +
        `&projection=minimal`)
      .pipe(map(this.toObject));
  }
}