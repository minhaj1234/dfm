import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { ExternalService, Resource, RestService } from 'angular4-hal';
import { IResultsWithPages } from 'core/models';
import { getPagination } from 'core/utilities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CommonService<T extends Resource> extends RestService<T> {
  protected _resource: string;
  protected toObject: any;
  protected pageSize: number;

  constructor(
    type: new () => T,
    resourcePath: string,
    protected externalService: ExternalService,
    injector: Injector,
  ) {
    super(type, resourcePath, injector);
    this._resource = resourcePath;
  }

  getSingleMinimal(decisionId: string): Observable<T> {
    return this.externalService.getHttp()
      .get(`${this.externalService.getURL()}${this._resource}/${decisionId}?projection=minimal`)
      .pipe(map(this.toObject));
  }

  getSingleEdit(objectId: string): Observable<T> {
    return this.externalService.getHttp()
      .get(`${this.externalService.getURL()}${this._resource}/${objectId}?projection=edit`)
      .pipe(map(this.toObject));
  }

  getSingleObjectForDiagram(objectId: string): Observable<T> {
    return this.externalService.getHttp()
      .get(`${this.externalService.getURL()}${this._resource}/${objectId}?projection=diagram`)
      .pipe(map(this.toObject));
  }

  getSomeMinimalWithSearch(searchTerm = '', pageNumber = 0): Observable<IResultsWithPages<T>> {
    const uriEncodedSearchTerm = encodeURIComponent(searchTerm);
    const url =
      `${this.externalService.getURL()}${this._resource}/search/findByNameIgnoreCaseContainingOrDescriptionIgnoreCaseContaining` +
      `?partialName=${uriEncodedSearchTerm}&partialDescription=${uriEncodedSearchTerm}&size=${this.pageSize}&page=${pageNumber}&projection=minimal`;
    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map((object: any) => this.toPageableObject(object)));
  }

  getByUrl(url: string): Observable<IResultsWithPages<T>> {
    return this.externalService.getHttp()
      .get(url)
      .pipe(map((object: any) => this.toPageableObject(object)));
  }

  addRelatedObject(sourceObjectRelatedHref: string, body: string, headers: HttpHeaders): Observable<Object> {
    return this.externalService.getHttp().post(sourceObjectRelatedHref, body, {
      headers,
    });
  }

  removeRelatedObject(sourceObjectRelatedHref: string, relatedObjectId: string, headers?: HttpHeaders): Observable<Object> {
    return this.externalService.getHttp().delete(`${sourceObjectRelatedHref}/${relatedObjectId}`, {
      headers: headers
    });
  }

  updateRelatedObject(sourceObjectRelatedHref: string, body: string, headers: HttpHeaders): Observable<Object> {
    return this.externalService.getHttp().patch(sourceObjectRelatedHref, body, {
      headers,
    });
  }

  toPageableObject(objs: any): IResultsWithPages<T> {
    const pagination = getPagination(objs);
    const results = [...(objs._embedded ? objs._embedded[this._resource] || [] : []).map(this.toObject)];
    return {
      pagination,
      results,
    };
  }
}
