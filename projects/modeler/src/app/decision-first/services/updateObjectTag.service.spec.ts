import { async, TestBed } from '@angular/core/testing';
import { Tag } from '../models/tag.model';
import { UpdateObjectTagService } from './updateObjectTag.service';

describe('UpdateObjectTagService', () => {
  let service: UpdateObjectTagService;

  const tags = [{
      id: 'tag1Id', 
      name: '#tag1'
    } as Tag, {
      id: 'tag2Id', 
      name: '#tag2'
    } as Tag, {
      id: 'tag3Id', 
      name: '#tag3'
    } as Tag
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [UpdateObjectTagService]
    });
    service = TestBed.get(UpdateObjectTagService);
  });

  it('should be created', async(() => {
    expect(service).toBeTruthy();
  }));

  describe('getMissingTagNames', () => {
    it('should return missing tags names', () => {
      const expected = ['#tag4'];
      
      const missingTags = service.getMissingTagNames({name: '#tag1 text #tag4 text', description: '#tag4 text', tags});

      expect(missingTags).toEqual(expected);
    });

    it('should return empty array if there are no missing tags', () => {
      const missingTags = service.getMissingTagNames({name: '#tag1 text #tag2 text', description: '#tag3 text', tags});

      expect(missingTags).toEqual([]);
    });

    it('should return empty array if objectTagsUpdate is undefined', () => {
      const missingTags = service.getMissingTagNames(undefined);

      expect(missingTags).toEqual([]);
    });
  });

  describe('getExtraTags', () => {
    it('should return extra tags', () => {
      const expected = [tags[1], tags[2]];
      
      const extraTags = service.getExtraTags({name: '#tag1 text #tag4 text', description: '#tag4 text', tags});

      expect(extraTags).toEqual(expected);
    });

    it('should return empty array if there are no extra tags', () => {
      const extraTags = service.getExtraTags({name: '#tag1 text #tag2 text', description: '#tag3 text', tags});

      expect(extraTags).toEqual([]);
    });

    it('should return empty array if objectTagsUpdate is undefined', () => {
      const extraTags = service.getExtraTags(undefined);

      expect(extraTags).toEqual([]);
    });
  });
});