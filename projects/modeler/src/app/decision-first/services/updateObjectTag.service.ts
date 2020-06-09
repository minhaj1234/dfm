import { Injectable } from '@angular/core';
import * as XRegExp from 'xregexp';
import { ObjectTagsUpdate, Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class UpdateObjectTagService {
  getMissingTagNames(object: ObjectTagsUpdate): string[] {
    if (!object) {
      return [];
    }

    const stringContainingTags = object.name.concat(' ', object.description);
    const tagNames = this.findTagNames(stringContainingTags);
    const savedTagNames = object.tags.map(tag => tag.name.toLowerCase());
    const missingTagNames = tagNames.filter(tagName => !savedTagNames.includes(tagName));

    return missingTagNames;
  }

  getExtraTags(object: ObjectTagsUpdate): Tag[] {
    if (!object) {
      return [];
    }
    
    const stringContainingTags = object.name.concat(' ', object.description);
    const tagNames = this.findTagNames(stringContainingTags);
    const extraTags = object.tags.filter((tag) => !tagNames.includes(tag.name.toLowerCase()));
   
    return extraTags;
  }

  private findTagNames(text: string): string[] {
    const allTagNames = XRegExp
      .match(text, XRegExp('#[\\pL\\pN]+'), 'all')
      .map((tagName) => tagName.toLowerCase());
    const uniqueTagNames = allTagNames.filter((tagName, index, self) => self.indexOf(tagName) === index);

    return uniqueTagNames;
  }
}