import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { diff } from 'deep-diff';
import { DecisionImplementationTableSections } from '../../../../models/decisionImplementationTable.model';
import { DecisionImplementationTableService } from './decision-implementation-table.service';

describe('DecisionImplementationTableService', () => {
  let service: DecisionImplementationTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DecisionImplementationTableService, FormBuilder],
    });
    service = TestBed.get(DecisionImplementationTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createDefaultConditionHeaderFormGroup', () => {
    it('should create condition header form group with order', () => {
      const header = service.createDefaultConditionHeaderFormGroup(2);

      expect(header.controls.section.value).toEqual(DecisionImplementationTableSections.Conditions);
      expect(header.controls.order.value).toEqual(2);
    });
  });

  describe('createDefaultAnswerHeaderFormGroup', () => {
    it('should create condition header form group with order', () => {
      const header = service.createDefaultAnswerHeaderFormGroup(2);

      expect(header.controls.section.value).toEqual(DecisionImplementationTableSections.Answers);
      expect(header.controls.order.value).toEqual(2);
    });
  });

  describe('createDefaultCommentHeaderFormGroup', () => {
    it('should create condition header form group with order', () => {
      const header = service.createDefaultCommentHeaderFormGroup(2);

      expect(header.controls.section.value).toEqual(DecisionImplementationTableSections.Comments);
      expect(header.controls.order.value).toEqual(2);
    });
  });

  describe('createCellFormGroup', () => {
    it('should create cell form group', () => {
      const cell = service.createCellFormGroup('row1', 'header1');

      expect(cell.controls.rowId.value).toEqual('row1');
      expect(cell.controls.headerId.value).toEqual('header1');
    });
  });

  describe('formGroupOrderComparator', () => {
    it('should return -1 if first order less than second', () => {
      const firstHeader = service.createDefaultConditionHeaderFormGroup(1);
      const secondHeader = service.createDefaultConditionHeaderFormGroup(2);

      expect(service.formGroupOrderComparator(firstHeader, secondHeader)).toEqual(-1);
    });

    it('should return 1 if first order greater than second', () => {
      const firstHeader = service.createDefaultConditionHeaderFormGroup(2);
      const secondHeader = service.createDefaultConditionHeaderFormGroup(1);

      expect(service.formGroupOrderComparator(firstHeader, secondHeader)).toEqual(1);
    });
  });

  describe('getMissingHeadersFormGroups', () => {
    it('should return missing headers form groups', () => {
      const firstTable = {headers: [{id: 'header1'}, {id: 'header2'}]} as any;
      const secondTable = {headers: [{id: 'header1'}, {id: 'header2'}, {id: 'header3'}]} as any;

      const missingHeadersIds  = service
        .getMissingHeaders(firstTable, secondTable)
        .map((header) => header.id);
      
      expect(missingHeadersIds).toEqual(['header3']);
    });
  });

  describe('getExtraHeaders', () => {
    it('should return extra headers', () => {
      const firstTable = {headers: [{id: 'header1'}, {id: 'header2'}, {id: 'header3'}]} as any;
      const secondTable = {headers: [{id: 'header1'}, {id: 'header3'}]} as any;

      const missingHeadersIds  = service
        .getExtraHeaders(firstTable, secondTable)
        .map((header) => header.id);
      
      expect(missingHeadersIds).toEqual(['header2']);
    });
  });

  describe('getMissingRowsFormGroups', () => {
    it('should return missing rows form groups', () => {
      const firstTable = {rows: [{id: 'row1'}, {id: 'row2'}]} as any;
      const secondTable = {rows: [{id: 'row1'}, {id: 'row2'}, {id: 'row3', order: 1, cells: [{id: 'cell1'}]}]} as any;

      const missingRowsIds  = service
        .getMissingRows(firstTable, secondTable)
        .map((row) => row.id);
      
      expect(missingRowsIds).toEqual(['row3']);
    });
  });

  describe('getExtraRows', () => {
    it('should return extra rows', () => {
      const firstTable = {rows: [{id: 'row1'}, {id: 'row2'}, {id: 'row3'}]} as any;
      const secondTable = {rows: [{id: 'row1'}, {id: 'row3'}]} as any;

      const missingHRowsIds  = service
        .getExtraRows(firstTable, secondTable)
        .map((row) => row.id);
      
      expect(missingHRowsIds).toEqual(['row2']);
    });
  });

  describe('getTableDiffs', () => {
    it('should return table diffs', () => {
      const firstTable = {option: 'option1'} as any;
      const secondTable = {option: 'option2'} as any;

      const diffs  = service
        .getTableDiffs(firstTable, secondTable)
        .map((difference) => difference.path[0]);
      
      expect(diffs).toEqual(['option']);
    });

    it('should not return table diffs', () => {
      const firstTable = {option: 'option1'} as any;
      const secondTable = {option: 'option1'} as any;

      const diffs  = service.getTableDiffs(firstTable, secondTable);
      
      expect(diffs).toEqual([]);
    });
  });

  describe('getOwnEditDiffs', () => {
    it('should return own edit diffs', () => {
      const diffs = diff({ id: 'row1', order: 1, cells: []}, { id: 'row1', order: 2, cells: [{}]});

      const result = service
        .getOwnEditDiffs(diffs)
        .map((value) => value.path[0]);

      expect(result).toEqual(['order']);
    });

    it('should return empty array if there are no diffs', () => {
      const diffs = diff({ id: 'row1', order: 1, cells: []}, { id: 'row1', order: 1, cells: [{}]});

      const result = service.getOwnEditDiffs(diffs);

      expect(result).toEqual([]);
    });
  });

  describe('getAddDiffs', () => {
    it('should return add diffs', () => {
      const diffs = diff({ id: 'row2', order: 1, cells: []}, { id: 'row1', order: 2, cells: [{}]});

      const result = service
        .getAddDiffs(diffs)
        .map((value) => value.path[0]);

      expect(result).toEqual(['cells']);
    });

    it('should return empty array if there are no diffs', () => {
      const diffs = diff({ id: 'row2', order: 1, cells: []}, { id: 'row1', order: 2, cells: []});

      const result = service.getAddDiffs(diffs);

      expect(result).toEqual([]);
    });
  });

  describe('getNestedEditDiffs', () => {
    it('should return nested edit diffs', () => {
      const diffs = diff({ id: 'row2', order: 1, cells: [{text: 'text1' }]}, { id: 'row1', order: 2, cells: [{text: 'text2' }]});

      const result = service
        .getNestedEditDiffs(diffs)
        .map((value) => value.path[0]);

      expect(result).toEqual(['cells']);
    });

    it('should return empty array if there are no diffs', () => {
      const diffs = diff({ id: 'row1', order: 2, cells: []}, { id: 'row1', order: 2, cells: []});

      const result = service.getNestedEditDiffs(diffs);

      expect(result).toEqual([]);
    });
  });

  describe('getDeleteDiffs', () => {
    it('should return delete diffs', () => {
      const diffs = diff({ id: 'row2', order: 1, cells: [{text: 'text1' }]}, { id: 'row1', order: 2, cells: []});

      const result = service
        .getDeleteDiffs(diffs)
        .map((value) => value.path[0]);

      expect(result).toEqual(['cells']);
    });

    it('should return empty array if there are no diffs', () => {
      const diffs = diff({ id: 'row2', order: 1, cells: [{text: 'text1' }]}, { id: 'row1', order: 2, cells: [{text: 'text1' }]});

      const result = service.getDeleteDiffs(diffs);

      expect(result).toEqual([]);
    });
  });
});
