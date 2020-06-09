import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormGroupTyped } from 'core/utilities';
import { diff } from 'deep-diff';
import { Guid } from 'guid-typescript';
import {
  DecisionImplementationTable,
  DecisionImplementationTableSections
} from '../../../../models/decisionImplementationTable.model';
import * as decisionTable from '../../../../models/decisionImplementationTable.model';
import { groupDiffs, DiffKinds } from '../../../../utilitites/groupDiffsFromDeepDiff';

@Injectable()
export class DecisionImplementationTableService {
  private toOmitFromCompare = {
    __gohashid: true,
  };

  constructor(private formBuilder: FormBuilder) { }

  createDefaultConditionHeaderFormGroup(order: number, topTitleText: string, bottomTitleText: string): FormGroupTyped<decisionTable.Header> {
    return new FormGroup({
      id: new FormControl(Guid.create().toString()),
      topTitle: new FormControl(topTitleText),
      bottomTitle: new FormControl(bottomTitleText),
      order: new FormControl(order),
      section: new FormControl(DecisionImplementationTableSections.Conditions),
      relatedObjectId: new FormControl(''),
    }) as FormGroupTyped<decisionTable.Header>;
  }

  createDefaultAnswerHeaderFormGroup(order: number, topTitleText: string, bottomTitleText: string): FormGroupTyped<decisionTable.Header> {
    return new FormGroup({
      id: new FormControl(Guid.create().toString()),
      topTitle: new FormControl(topTitleText),
      bottomTitle: new FormControl(bottomTitleText),
      order: new FormControl(order),
      section: new FormControl(DecisionImplementationTableSections.Answers),
      relatedObjectId: new FormControl(''),
    }) as FormGroupTyped<decisionTable.Header>;
  }

  createDefaultCommentHeaderFormGroup(order: number, topTitleText: string, bottomTitleText: string): FormGroupTyped<decisionTable.Header> {
    return new FormGroup({
      id: new FormControl(Guid.create().toString()),
      topTitle: new FormControl(topTitleText),
      bottomTitle: new FormControl(bottomTitleText),
      order: new FormControl(order),
      section: new FormControl(DecisionImplementationTableSections.Comments),
      relatedObjectId: new FormControl(''),
    }) as FormGroupTyped<decisionTable.Header>;
  }

  createCellFormGroup(rowId: string, headerId: string, text: string): FormGroupTyped<decisionTable.Cell> {
    return new FormGroup({
      id: new FormControl(Guid.create().toString()),
      text: new FormControl(text),
      rowId: new FormControl(rowId),
      headerId: new FormControl(headerId),
    }) as FormGroupTyped<decisionTable.Cell>;
  }

  updateCellFormGroup(rowId: string, cellId: string, headerId: string, text: string): FormGroupTyped<decisionTable.Cell> {
    return new FormGroup({
      id: new FormControl(cellId),
      text: new FormControl(text),
      rowId: new FormControl(rowId),
      headerId: new FormControl(headerId),
    }) as FormGroupTyped<decisionTable.Cell>;
  }

  findTableEntitiesDiffs<T extends { id: string }>(from: T[], to: T[]): T[] {
    return to.reduce((diffs, itemTo) => {
      if (!from.some((itemFrom) => itemFrom.id === itemTo.id)) {
        diffs.push(itemTo);
      }
      return diffs
    }, [] as T[]);
  }

  formGroupOrderComparator(
    firstItem: FormGroupTyped<decisionTable.Header | decisionTable.Row>,
    secondItem: FormGroupTyped<decisionTable.Header | decisionTable.Row>
  ): number {
    return firstItem.controls.order.value - secondItem.controls.order.value
  }

  getMissingHeaders(currentTable: DecisionImplementationTable, newTable: DecisionImplementationTable): decisionTable.Header[] {
    return this.findTableEntitiesDiffs<decisionTable.Header>(currentTable.headers, newTable.headers) || [];
  }

  createHeaderFormGroup(header: decisionTable.Header): FormGroupTyped<decisionTable.Header> {
    return this.formBuilder.group({
      id: header.id,
      topTitle: header.topTitle,
      bottomTitle: header.bottomTitle,
      order: header.order,
      section: header.section,
      relatedObjectId: header.relatedObjectId,
    }) as FormGroupTyped<decisionTable.Header>;
  }

  getTableDiffs(currentTable: DecisionImplementationTable, newTable: { option: string }): deepDiff.IDiff[] {
    const diffs = diff(currentTable, newTable) || [];
    const groupedDiffs = groupDiffs(diffs, this.toOmitFromCompare);

    return groupedDiffs.E || [];
  }

  getExtraHeaders(currentTable: DecisionImplementationTable, newTable: DecisionImplementationTable): decisionTable.Header[] {
    return this.findTableEntitiesDiffs<decisionTable.Header>(newTable.headers, currentTable.headers);
  }

  getMissingRows(currentTable: DecisionImplementationTable, newTable: DecisionImplementationTable): decisionTable.Row[] {
    return this.findTableEntitiesDiffs<decisionTable.Row>(currentTable.rows, newTable.rows);
  }

  createRowFormGroup(row: decisionTable.Row): FormGroupTyped<decisionTable.Row> {
    return this.formBuilder.group({
      id: row.id,
      order: row.order,
      cells: this.formBuilder.array(this.createCellsFormArray(row))
    }) as FormGroupTyped<decisionTable.Row>;
  }

  createCellsFormArray(row: decisionTable.Row): FormGroupTyped<decisionTable.Cell>[] {
    return row.cells.map((cell) => {
      const cellFormGroup = this.formBuilder.group(cell) as FormGroupTyped<decisionTable.Cell>

      return cellFormGroup;
    });
  }

  getExtraRows(currentTable: DecisionImplementationTable, newTable: DecisionImplementationTable): decisionTable.Row[] {
    return this.findTableEntitiesDiffs<decisionTable.Row>(newTable.rows, currentTable.rows);
  }

  getDiffs<T extends decisionTable.Header | decisionTable.Row>(from: T[], to: T[]): Record<string, deepDiff.IDiff[]> {
    return from.reduce((diferences: Record<string, deepDiff.IDiff[]>, fromItem) => {
      const toItem = to.find((item) => item.id === fromItem.id);
      const diffs = diff(fromItem, toItem) || [];

      diferences[toItem.id] = diffs;
      return diferences;
    }, {});
  }

  getOwnEditDiffs(diffs: deepDiff.IDiff[]): deepDiff.IDiff[] {
    const editDiffs = groupDiffs(diffs, this.toOmitFromCompare).E || []

    return editDiffs.filter((editDiff) => editDiff.path.length === 1);
  }

  getNestedEditDiffs(diffs: deepDiff.IDiff[]): deepDiff.IDiff[] {
    const editDiffs = groupDiffs(diffs, this.toOmitFromCompare).E || []

    return editDiffs.filter((editDiff) => editDiff.path.length > 1);
  }

  getAddDiffs(diffs: deepDiff.IDiff[]): deepDiff.IDiff[] {
    const groupDifferences = groupDiffs(diffs, this.toOmitFromCompare).A || [];
    return groupDifferences.filter((difference) => difference.item.kind === DiffKinds.PropertyOrElementAdded);
  }

  getDeleteDiffs(diffs: deepDiff.IDiff[]): deepDiff.IDiff[] {
    const groupDifferences = groupDiffs(diffs, this.toOmitFromCompare).A || [];
    return groupDifferences.filter((difference) => difference.item.kind === DiffKinds.PropertyOrElementDeleted);
  }
}
