import { Injectable, Injector } from '@angular/core';
import { ExternalService } from 'angular4-hal';
import { IResultsWithPages } from 'core/models';
import { APPLICATION_JSON_HEADER, CommonService } from 'core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config } from '../../config';
import { ObjectRelationsNames } from '../models/objects.model';
import { Tag } from '../models/tag.model';
import { toTag } from '../utilitites/mappings';

@Injectable({
  providedIn: 'root',
})
export class TagsService extends CommonService<Tag> {
  constructor(externalService: ExternalService, injector: Injector) {
    super(Tag, ObjectRelationsNames.Tags, externalService, injector);
    this.toObject = toTag;
    this.pageSize = Config.pageSize;
  }

  getSomeMinimalWithSearch(searchTerm = '', page = 0): Observable<IResultsWithPages<Tag>> {
    const url =
      `${this.externalService.getURL()}${this._resource}/search/findByNameIgnoreCaseContaining` +
      `?partialName=${searchTerm}&size=${Config.pageSize}&page=${page}&projection=minimal`;
    return this.externalService
      .getHttp()
      .get(url)
      .pipe(map((object: any) => this.toPageableObject(object)));
  }

  mergeTags(sourceTag: string, relatedTag: string): Observable<Object> {
    return this.externalService.getHttp().patch(`${this.externalService.getURL()}${ObjectRelationsNames.Tags}/${sourceTag}/merge/${relatedTag}`, {});
  }

  updateObjectTags(body: { namesToAdd: string[], idsToDelete: string[] }, id: string, resource: string): Observable<Object> {
    return this.externalService.getHttp().post(`${this.externalService.getURL()}${ObjectRelationsNames.Tags}/${resource}/${id}`, body, {
      headers: APPLICATION_JSON_HEADER
    });
  }
}
