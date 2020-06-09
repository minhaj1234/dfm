import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ResizeEvent } from 'angular-resizable-element';
import { FormArrayTyped, FormGroupTyped } from 'core/utilities';
import { Guid } from 'guid-typescript';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Config } from 'projects/modeler/src/app/config';
import { Observable } from 'rxjs';
import { debounceTime, filter, first, map } from 'rxjs/operators';
import { AnswerType, Decision, IDecisionCells } from '../../../../models/decision.model';
import {
  DecisionImplementationTable,
  DecisionImplementationTableCellType,
  DecisionImplementationTableSections
} from '../../../../models/decisionImplementationTable.model';
import * as decisionTable from '../../../../models/decisionImplementationTable.model';
import { ObjectRelationsNames } from '../../../../models/objects.model';
import { DecisionAnswerService } from '../../../../services';
import * as fromModelerStore from '../../../../store';
import { Actions, ofType } from '@ngrx/effects';
import { DecisionImplementationTableService } from '../decision-implementation-table-service/decision-implementation-table.service';
import {
  DECISION_TABLE_OPTIONS,
  DEFAULT_HEADER_HEIGHT,
  FROZENCOLUMN_WIDTH,
  MIN_SCROLL_HEIGHT,
  POPOVER_OPEN_DELAY,
  SCROLL_HEIGHT,
  TABLE_CONTAINER_HEADER_HEIGHT,
  TABLE_HEADER_HEIGHT,
  TABLE_CONTAINER_EXPANDED_HEIGHT
} from '../decision-implementation-table.const';

@Component({
  selector: 'dfm-decision-implementation-table-container',
  templateUrl: './decision-implementation-table-container.component.html',
  styleUrls: ['./decision-implementation-table-container.component.scss'],
})
export class DecisionImplementationTableContainerComponent implements OnInit, OnDestroy {
  public decisionTableOptions = DECISION_TABLE_OPTIONS;
  public popoverOpenDelay = POPOVER_OPEN_DELAY;
  public DecisionImplementationTableContainerStyle: object = {};
  public frozenHeaderWidth = FROZENCOLUMN_WIDTH;
  public scrollHeight = SCROLL_HEIGHT;
  public cellType = DecisionImplementationTableCellType;
  public tableForm: FormGroup;
  public isExpanded = false;
  private heightBeforeExpand: number;
  private _decision: Decision;
  private sendChanges = true;
  private createDuplicateRow: boolean = false;
  private createDuplicateColumn: boolean = false;
  @ViewChild(ContextMenuComponent, { static: true }) public tableContextMenu: ContextMenuComponent;
  @ViewChild('bottomHeaderRow', { static: false }) bottomHeaderRow: ElementRef;
  @Output() expand = new EventEmitter();
  @Input() isReadOnly: boolean;
  @Input() tableContainer: ElementRef;
  @Input() expanded: boolean;
  @Input() set decision(decision: Decision) {
    this._decision = decision;

    if (decision && decision.decisionImplementationTable && this.tableForm) {
      this.sendChanges = false;
      this.updateTable();
      this.sendChanges = true;

      this.checkAnswerHeadersValue();
    }
    setTimeout(() => this.changeDetectorRef.detectChanges());
  };

  get decision(): Decision {
    return this._decision;
  }

  get headersFormArray(): FormArrayTyped<decisionTable.Header> {
    return this.tableForm.get('headers') as FormArrayTyped<decisionTable.Header>;
  }

  get rowsFormArray(): FormArrayTyped<decisionTable.Row> {
    return this.tableForm.get('rows') as FormArrayTyped<decisionTable.Row>;
  }

  get currentTable(): DecisionImplementationTable {
    return this.tableForm.getRawValue();
  }

  constructor(
    private formBuilder: FormBuilder,
    private modelerStore: Store<fromModelerStore.IDecisionFirstState>,
    private tableService: DecisionImplementationTableService,
    private changeDetectorRef: ChangeDetectorRef,
    private decisionAnswerService: DecisionAnswerService,
    private translateService: TranslateService) {
    this.createTableForm();
  }

  createTableForm(): void {
    this.tableForm = this.formBuilder.group({
      id: this.formBuilder.control(''),
      option: this.formBuilder.control(''),
      headers: this.formBuilder.array([]),
      rows: this.formBuilder.array([]),
    });

    this.subscribeTableOptionValueChanges(this.tableForm.controls.option);
  }

  doesRemoveColumnMenuItemVisible = (item: { header: FormGroupTyped<decisionTable.Header> }): boolean => {
    const sectionColumns = !!item.header
      ? this.headersFormArray.controls.filter((header) => header.controls.section.value === item.header.controls.section.value)
      : [];

    return sectionColumns.length > 1;
  };

  doesAddColumnMenuItemVisible = (item: { header: FormGroupTyped<decisionTable.Header> }): boolean => {
    return !!item.header;
  };

  doesAddRowMenuItemVisible = (item: { row: FormGroupTyped<decisionTable.Row> }): boolean => {
    return !!item.row;
  };

  doesRemoveRowMenuItemVisible = (item: { row: FormGroupTyped<decisionTable.Row> }): boolean => {
    return !!item.row && this.rowsFormArray.controls.length > 1;
  };

  doescopyCellMenuItemVisible = (item: { cell: FormGroupTyped<decisionTable.Cell> }): boolean => {
    return !!item.cell;
  };

  ngOnInit() {
    this.translateService.onLangChange.subscribe(() => {
      this.checkAnswerHeadersValue();
    });
    this.isDecisionTableExpanded(this.expanded);
  }

  isDecisionTableExpanded(expanded) {
    this.isExpanded = expanded;
    if (expanded === true) {
      this.heightBeforeExpand = this.scrollHeight;
      this.updateDecisionImplementationTableScrollHeight(TABLE_CONTAINER_EXPANDED_HEIGHT);
    }
  }

  subscribeTableOptionValueChanges(optionFormControl: AbstractControl): void {
    this.subscribeValueChanges(
      optionFormControl,
      (value: string) => {
        const relationPath = `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}`;
        const body = { option: value } as DecisionImplementationTable;

        this.dispatchUpdateAction(body, relationPath);
      });
  }

  subscribeHeaderValueChanges(headerFormGroup: FormGroupTyped<decisionTable.Header>): void {
    this.subscribeValueChanges(
      headerFormGroup,
      (value: decisionTable.Header) => {
        const relationPath = `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}/${ObjectRelationsNames.Headers}/${value.id}`;
        const body = { topTitle: value.topTitle, bottomTitle: value.bottomTitle } as decisionTable.Header;

        this.dispatchUpdateAction(body, relationPath)
      });
  }

  subscribeCellValueChanges(cellFormGroup: FormGroupTyped<decisionTable.Cell>): void {
    this.subscribeValueChanges(
      cellFormGroup,
      (value: decisionTable.Cell) => {
        const relationPath =
          `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}/`
          + `${ObjectRelationsNames.Rows}/${value.rowId}/`
          + `${ObjectRelationsNames.Cells}/${value.id}`;
        const body = { text: value.text } as decisionTable.Cell;

        this.dispatchUpdateAction(body, relationPath);
      });
  }

  subscribeValueChanges(formGroum: AbstractControl, handler: Function): void {
    formGroum.valueChanges.pipe(
      filter(() => this.sendChanges),
      untilDestroyed(this),
      debounceTime(Config.debounceTime),
    )
      .subscribe((value) => handler(value));
  }

  dispatchUpdateAction(object: decisionTable.TableEntity, relationPath: string): void {
    this.modelerStore.dispatch(new fromModelerStore.UpdateImplementationTableEntity({
      sourceObject: this.decision,
      relatedObject: object,
      relationPath
    }));
  }

  updateTable(): void {
    this.updateTableDiff();
    this.updateHeadersDiff();
    this.updateRowsDiff();
    this.sortRowsByOrder();
    this.sortHeadersByOrder();
  }

  updateHeadersDiff(): void {
    this.addMissingHeaders();
    this.deleteExtraHeaders();
    this.updateHeaders();
  }

  updateRowsDiff(): void {
    this.addMissingRows();
    this.deleteExtraRows();
    this.updateRows();
  }

  updateTableDiff(): void {
    const diffs = this.tableService.getTableDiffs(this.currentTable, this.decision.decisionImplementationTable);
    diffs.forEach((diff) => {
      if (diff.path.length === 1) {
        this.tableForm.patchValue({ [diff.path[0]]: this.decision.decisionImplementationTable[diff.path[0]] });
      }
    });
  }

  addMissingHeaders(): void {
    this.tableService
      .getMissingHeaders(this.currentTable, this.decision.decisionImplementationTable)
      .map((header) => this.tableService.createHeaderFormGroup(header))
      .forEach((header) => {
        this.headersFormArray.push(header);
        this.subscribeHeaderValueChanges(header);
      });
  }

  deleteExtraHeaders(): void {
    this.tableService
      .getExtraHeaders(this.currentTable, this.decision.decisionImplementationTable)
      .forEach((header) => {
        const deletedHeader = this.getHeaderFormGroupById(header.id);
        this.headersFormArray.removeAt(this.headersFormArray.controls.indexOf(deletedHeader));
      });
  }

  updateHeaders(): void {
    const diffs = this.tableService
      .getDiffs<decisionTable.Header>(this.currentTable.headers, this.decision.decisionImplementationTable.headers);

    for (const headerId in diffs) {
      if (diffs[headerId]) {
        this.updateHeader(diffs[headerId], headerId);
      }
    }
  }

  updateHeader(diffs: deepDiff.IDiff[], headerId: string): void {
    const editDiffs = this.tableService.getOwnEditDiffs(diffs);

    editDiffs.forEach((diff) => {
      const property = diff.path[0];
      const updatedHeader = this.headersFormArray.controls.find(
        (header) => header.controls.id.value === headerId
      );

      updatedHeader.patchValue({
        [property]: diff.rhs
      })
    });
  }

  addMissingRows(): void {
    this.tableService
      .getMissingRows(this.currentTable, this.decision.decisionImplementationTable)
      .map((row) => this.tableService.createRowFormGroup(row))
      .forEach((row) => {
        this.rowsFormArray.push(row);
        this.subscribeCellsValueChanges(row.controls.cells as FormArrayTyped<decisionTable.Cell>);
      });
  }

  subscribeCellsValueChanges(cells: FormArrayTyped<decisionTable.Cell>): void {
    cells.controls.forEach((cell) => this.subscribeCellValueChanges(cell));
  }

  deleteExtraRows(): void {
    this.tableService
      .getExtraRows(this.currentTable, this.decision.decisionImplementationTable)
      .forEach((row) => {
        const deletedRow = this.getRowFormGroupById(row.id);
        this.rowsFormArray.removeAt(this.rowsFormArray.controls.indexOf(deletedRow));
      });
  }

  updateRows(): void {
    const diffs = this.tableService
      .getDiffs<decisionTable.Row>(this.currentTable.rows, this.decision.decisionImplementationTable.rows);

    for (const rowId in diffs) {
      if (diffs[rowId]) {
        this.updateRow(diffs[rowId], rowId);
      }
    }
  }

  updateRow(diffs: deepDiff.IDiff[] = [], rowId: string): void {
    const ownEditDiffs = this.tableService.getOwnEditDiffs(diffs);

    ownEditDiffs.forEach((diff) => this.updateRowOwnProperties(diff, rowId));
    this.updateCells(diffs, rowId);
  }

  updateCells(diffs: deepDiff.IDiff[] = [], rowId: string): void {
    const editDiffs = this.tableService.getNestedEditDiffs(diffs);
    const addDiffs = this.tableService.getAddDiffs(diffs);
    const deleteDiffs = this.tableService.getDeleteDiffs(diffs);

    addDiffs.forEach((diff) => this.addMissingCell(diff, rowId));
    deleteDiffs.forEach((diff) => this.deleteExtraCell(diff, rowId));
    editDiffs.forEach((diff) => this.updateCell(diff, rowId));
  }

  addMissingCell(diff: deepDiff.IDiff, rowId: string): void {
    const cells = this.getRowFormGroupById(rowId)
      .controls
      .cells as FormArrayTyped<decisionTable.Cell>;

    cells.push(this.formBuilder.group(diff.item.rhs));
  }

  deleteExtraCell(diff: deepDiff.IDiff, rowId: string): void {
    const cells = this.getRowFormGroupById(rowId)
      .controls
      .cells as FormArrayTyped<decisionTable.Cell>;
    const deletedCell = cells.controls.find((cell) => cell.controls.id.value === diff.item.lhs.id);

    cells.removeAt(cells.controls.indexOf(deletedCell));
  }

  updateCell(diff: deepDiff.IDiff, rowId: string): void {
    const cellIndex = diff.path[1];
    const property = diff.path[2];
    const updatedRowCells = this.getRowFormGroupById(rowId)
      .controls
      .cells as FormArrayTyped<decisionTable.Cell>;
    const updatedCell = updatedRowCells.controls[cellIndex];

    updatedCell.patchValue({
      [property]: diff.rhs
    });
  }

  updateRowOwnProperties(diff: deepDiff.IDiff, rowId: string): void {
    const property = diff.path[0];
    const updatedRow = this.getRowFormGroupById(rowId)

    updatedRow.patchValue({
      [property]: diff.rhs
    });
  }

  sortRowsByOrder(): void {
    this.rowsFormArray.controls.sort(this.tableService.formGroupOrderComparator);
  }

  sortHeadersByOrder(): void {
    this.headersFormArray.controls.sort(this.tableService.formGroupOrderComparator);
  }

  getHeaderFormGroupById(id: string): FormGroupTyped<decisionTable.Header> {
    return this.headersFormArray.controls.find((header) => header.controls.id.value === id);
  }

  getRowFormGroupById(id: string): FormGroupTyped<decisionTable.Row> {
    return this.rowsFormArray.controls.find((row) => row.controls.id.value === id);
  }

  isBorderHeader(header: FormGroupTyped<decisionTable.Header>): boolean {
    const headerIndex = this.headersFormArray.controls.indexOf(header);
    const prevHeader = this.headersFormArray.controls[headerIndex - 1] as FormGroupTyped<decisionTable.Header>;

    return prevHeader && prevHeader.controls.section.value !== header.controls.section.value;
  }

  getHeaderSectionClass(header: FormGroupTyped<decisionTable.Header>): string {
    switch (header.controls.section.value) {
      case DecisionImplementationTableSections.Conditions:
        return 'conditions-section';
      case DecisionImplementationTableSections.Answers:
        return 'answers-section';
      case DecisionImplementationTableSections.Comments:
        return 'comments-section';
    }
  }

  getRowNumber(row: FormGroupTyped<decisionTable.Row>): number {
    return row.controls.order.value;
  }

  addColumnBefore(event: { item: { header: FormGroupTyped<decisionTable.Header> } }): void {
    this.addColumn(event.item.header);
  }

  addColumnAfter(event: { item: { header: FormGroupTyped<decisionTable.Header> } }): void {
    this.addColumn(event.item.header, 1);
  }

  addDuplicateColumnAfter(event: { item: { header: FormGroupTyped<decisionTable.Header> } }): void {
    this.createDuplicateColumn = true
    this.addColumn(event.item.header, 1);
  }

  addColumn(targetHeader: FormGroupTyped<decisionTable.Header>, offset = 0): void {

    const newHeader = this.createHeaderFormGroupWithOrder(targetHeader.controls.section.value, targetHeader.controls.order.value + offset, targetHeader.controls.topTitle.value, targetHeader.controls.bottomTitle.value);
    const index = this.headersFormArray.controls.indexOf(targetHeader);

    this.subscribeHeaderValueChanges(newHeader);
    this.shiftHeadersOrder(newHeader.controls.order.value, 1);
    this.addCellsToExistingRows(newHeader, targetHeader.value.id);
    this.addHeaderFormGroupToTableForm(newHeader, index + offset);
    this.dispatchAddAction(newHeader.getRawValue(), ObjectRelationsNames.Headers);
    setTimeout(() => this.changeDetectorRef.detectChanges());
  }

  dispatchAddAction(
    addedEntity: decisionTable.Header | decisionTable.Row,
    relatedObjectPath: ObjectRelationsNames
  ): void {
    let requestBody: decisionTable.AddEntityRequestBody = new decisionTable.AddHeaderRequestBody();

    if (relatedObjectPath === ObjectRelationsNames.Headers) {
      requestBody = this.getAddHeaderRequestBody(addedEntity as decisionTable.Header);
    } else {
      requestBody = addedEntity as decisionTable.Row;
    }

    this.modelerStore.dispatch(new fromModelerStore.AddImplementationTableEntity({
      sourceObject: this.decision,
      relationPath: `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}/${relatedObjectPath}`,
      requestBody,
    }));
  }

  getAddHeaderRequestBody(header: decisionTable.Header): decisionTable.AddHeaderRequestBody {
    const rows: decisionTable.Row[] = [];

    this.rowsFormArray.controls.forEach((row) => {
      rows.push({ ...row.getRawValue(), cells: [this.getCellByHeaderId(row, header.id)] });
    });

    return { ...header, rows };
  }

  getCellByHeaderId(row: FormGroupTyped<decisionTable.Row>, id: string): decisionTable.Cell {
    const cells = row.controls.cells as FormArrayTyped<decisionTable.Cell>

    return cells.controls
      .find((cell) => cell.controls.headerId.value === id)
      .getRawValue();
  }

  createHeaderFormGroupWithOrder(section: DecisionImplementationTableSections, order: number, topTitle: string, bottomTitle: string): FormGroupTyped<decisionTable.Header> {
    switch (section) {
      case DecisionImplementationTableSections.Conditions:
        return this.tableService.createDefaultConditionHeaderFormGroup(order, this.createDuplicateColumn === true ? topTitle : `Condition X`, this.createDuplicateColumn === true ? bottomTitle : '');
      case DecisionImplementationTableSections.Answers:
        return this.tableService.createDefaultAnswerHeaderFormGroup(order, this.createDuplicateColumn === true ? topTitle : 'Decision Answer', this.createDuplicateColumn === true ? bottomTitle : '');
      case DecisionImplementationTableSections.Comments:
        return this.tableService.createDefaultCommentHeaderFormGroup(order, this.createDuplicateColumn === true ? topTitle : 'Messages', this.createDuplicateColumn === true ? bottomTitle : '');
    }
  }

  addHeaderFormGroupToTableForm(header: FormGroupTyped<decisionTable.Header>, index: number, ): void {
    this.headersFormArray.controls.splice(index, 0, header);
  }

  removeColumn(event: { item: { header: FormGroupTyped<decisionTable.Header> } }): void {
    const header = event.item.header;
    const index = this.headersFormArray.controls.indexOf(event.item.header);
    this.shiftHeadersOrder(header.controls.order.value, -1);

    this.removeHeaderFromTable(index);
    this.dispatchRemoveAction(header, ObjectRelationsNames.Headers);
    setTimeout(() => this.changeDetectorRef.detectChanges());
    this.checkAnswerHeadersValue();
  }

  removeHeaderFromTable(index: number): void {
    this.headersFormArray.controls.splice(index, 1);
  }

  dispatchRemoveAction(
    formGroup: FormGroupTyped<decisionTable.Header | decisionTable.Row>,
    relatedObjectPath: ObjectRelationsNames
  ): void {
    this.modelerStore.dispatch(new fromModelerStore.RemoveImplementationTableEntity({
      sourceObject: this.decision,
      relatedObjectId: formGroup.controls.id.value,
      relationPath: `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}/${relatedObjectPath}`
    }));
  }

  addRowBefore(event: { item: { row: FormGroupTyped<decisionTable.Row> } }): void {
    this.addRow(event.item.row);
  }

  addRowAfter(event: { item: { row: FormGroupTyped<decisionTable.Row> } }): void {
    this.addRow(event.item.row, 1);
  }

  addDuplicateRowAfter(event: { item: { row: FormGroupTyped<decisionTable.Row> } }): void {
    this.createDuplicateRow = true;
    this.addRow(event.item.row, 1);
  }

  addRow(targetRow: FormGroupTyped<decisionTable.Row>, offset = 0): void {
    const targetIndex = this.rowsFormArray.controls.indexOf(targetRow);
    const targetRowText: Array<string> = this.rowsFormArray.controls[targetIndex].value.cells.map((cell) => cell.text);
    const newRow = this.createRowFormGroupWithOrder(targetRow.controls.order.value + offset, targetRowText);
    const index = this.rowsFormArray.controls.indexOf(targetRow);

    this.shiftRowsOrder(newRow.controls.order.value, 1);
    this.addRowFormGroupToTableForm(index + offset, newRow);
    this.dispatchAddAction(newRow.getRawValue(), ObjectRelationsNames.Rows);
  }

  createRowFormGroupWithOrder(order: number, targetRowText: Array<string>): FormGroupTyped<decisionTable.Row> {
    const newRowId = Guid.create().toString();
    const newRow = this.formBuilder.group({
      id: newRowId,
      order: order,
      cells: this.formBuilder.array(this.createCellsFormGroups(newRowId, targetRowText))
    }) as FormGroupTyped<decisionTable.Row>;
    this.createDuplicateRow = false;
    return newRow;
  }

  updateRowFormGroupWithOrder(index: number, updatedRowText: Array<string>): FormGroupTyped<decisionTable.Row> {
    const targetRow = this.rowsFormArray.controls[index];
    const cellIds: Array<string> = targetRow.value.cells.map(cell => {
      return cell.id;
    })
    const newRow = this.formBuilder.group({
      id: targetRow.value.id,
      order: targetRow.value.order,
      cells: this.formBuilder.array(this.updateCellsFormGroups(targetRow.value.id, cellIds, updatedRowText))
    }) as FormGroupTyped<decisionTable.Row>;
    this.createDuplicateRow = false;
    return newRow;
  }

  createCellsFormGroups(rowId: string, targetRowText: Array<string>): FormGroupTyped<decisionTable.Cell>[] {
    return this.headersFormArray.controls.map((header, i) => {
      const cell = this.tableService.createCellFormGroup(rowId, header.controls.id.value, this.createDuplicateRow === true ? targetRowText[i] : '');
      this.subscribeCellValueChanges(cell);
      return cell;
    }) as FormGroupTyped<decisionTable.Cell>[];
  }

  updateCellsFormGroups(rowId: string, cellIds: Array<string>, targetRowText: Array<string>): FormGroupTyped<decisionTable.Cell>[] {
    return this.headersFormArray.controls.map((header, i) => {
      const cell = this.tableService.updateCellFormGroup(rowId, cellIds[i], header.controls.id.value, targetRowText[i]);
      return cell;
    }) as FormGroupTyped<decisionTable.Cell>[];
  }

  addRowFormGroupToTableForm(index: number, newRow: FormGroupTyped<decisionTable.Row>): void {
    this.rowsFormArray.controls.splice(index, 0, newRow);
  }

  removeRow(event: { item: { row: FormGroupTyped<decisionTable.Row> } }): void {
    const row = event.item.row;
    const index = this.rowsFormArray.controls.indexOf(row);
    this.shiftRowsOrder(row.controls.order.value, - 1);

    this.rowsFormArray.controls.splice(index, 1);
    this.dispatchRemoveAction(row, ObjectRelationsNames.Rows);
  }

  copyRow(event: { item: { row: FormGroupTyped<decisionTable.Row> } }): void {
    const rowValues = event.item.row.value.cells.map(cell => cell.text);
    const val = rowValues.join(`\t`);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  replaceRowFormGroupToTableForm(index: number, tempRow: FormGroupTyped<decisionTable.Row>): void {
    this.rowsFormArray.controls[index].patchValue(tempRow.value, { emitEvent: false });
    this.changeDetectorRef.detectChanges();
  }

  pasteRow(event: { item: { row: FormGroupTyped<decisionTable.Row> } }): void {
    const rowId = event.item.row.value.id;
    const selectedRow = event.item.row;
    const index = this.rowsFormArray.controls.indexOf(selectedRow);

    window.navigator.clipboard.readText()
      .then(text => {
        const cellsData: Array<IDecisionCells> = [];
        const rowTextArray: Array<string> = text.split(`\t`);
        this.createDuplicateRow = true;
        const tempRow = this.updateRowFormGroupWithOrder(event.item.row.value.order - 1, rowTextArray);
        this.createDuplicateRow = false;

        if (selectedRow.value.cells.length >= rowTextArray.length) {
          const relationPath = `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}/` + `${ObjectRelationsNames.Rows}`;
          const cells: Array<{ 'id': string, 'text': string }> = selectedRow.value.cells.map((cell, i) => {
            return { 'id': cell.id, 'text': rowTextArray[i] }
          })
          const body = {
            "rows": [{
              "id": rowId,
              "cells": cells
            }
            ]
          } as decisionTable.Rows
          this.dispatchUpdateAction(body, relationPath)
          this.replaceRowFormGroupToTableForm(index, tempRow);
        }

      })
      .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }

  shiftHeadersOrder(order: number, offset: number): void {
    this.shiftFormGroupsOrder(this.headersFormArray.controls, order, offset);
  }

  shiftRowsOrder(order: number, offset: number): void {
    this.shiftFormGroupsOrder(this.rowsFormArray.controls, order, offset);
  }

  shiftFormGroupsOrder(formGroups: FormGroupTyped<decisionTable.Row | decisionTable.Header>[], order: number, offset: number): void {
    this.sendChanges = false;
    formGroups.map((item) => {
      if (item.controls.order.value >= order) {
        item.patchValue({ order: item.controls.order.value + offset });
      }
    });
    this.sendChanges = true;
  }

  addCellsToExistingRows(header: FormGroupTyped<decisionTable.Header>, targetHeaderId): void {
    this.sendChanges = false;
    var targetheaderCellsValue: Array<string> = []
    this.rowsFormArray.controls.forEach((row, i) => {
      row.value.cells.forEach(cell => {
        if (cell.headerId === targetHeaderId)
          targetheaderCellsValue.push(cell.text)
      })
      if (this.createDuplicateColumn === true) {
        const cell = this.tableService.createCellFormGroup(row.controls.id.value, header.controls.id.value, targetheaderCellsValue[i]);
        (row.controls.cells as FormArrayTyped<decisionTable.Cell>).push(cell);
        this.subscribeCellValueChanges(cell);
      } else {
        const cell = this.tableService.createCellFormGroup(row.controls.id.value, header.controls.id.value, "");
        (row.controls.cells as FormArrayTyped<decisionTable.Cell>).push(cell);
        this.subscribeCellValueChanges(cell);
      }
    });
    this.sendChanges = true;
    this.createDuplicateColumn = false
  }

  onResizingDecisionImplementationTableContainer(event: ResizeEvent): void {
    this.updateDecisionImplementationTableScrollHeight(event.rectangle.height);
  }

  updateDecisionImplementationTableScrollHeight(containeHeight: number): void {
    const estimatedScrollHeight = containeHeight - TABLE_CONTAINER_HEADER_HEIGHT;

    this.scrollHeight = estimatedScrollHeight >= MIN_SCROLL_HEIGHT
      ? estimatedScrollHeight
      : this.scrollHeight;
  }

  getScrollHeightWithUnits(): string {
    return `${this.scrollHeight}px`;
  }

  getRowIndex(row: FormGroupTyped<decisionTable.Row>): number {
    return this.rowsFormArray.controls.indexOf(row);
  }

  getCellIndex(row: FormGroupTyped<decisionTable.Row>, header: FormGroupTyped<decisionTable.Header>): number {
    const cells: FormArrayTyped<decisionTable.Cell> = row.controls.cells as FormArrayTyped<decisionTable.Cell>;
    const cellIndex = cells.controls.indexOf(
      cells.controls.find((cell: FormGroupTyped<decisionTable.Cell>) => cell.controls.headerId.value === header.controls.id.value)
    );

    return cellIndex;
  }

  onExpand(): void {
    this.expand.next();
    this.isExpanded = !this.isExpanded;
    this.expandTable();
  }

  onCollapse() {
    this.expand.next();
    this.isExpanded = !this.isExpanded;
    this.collapseTable();
  }

  updateTableHeightAfterExpand(): void {
    if (!this.heightBeforeExpand) {
      this.expandTable();
    } else {
      this.collapseTable();
    }
  }

  expandTable(): void {
    this.heightBeforeExpand = this.scrollHeight;
    this.updateDecisionImplementationTableScrollHeight(this.tableContainer.nativeElement.offsetHeight - TABLE_HEADER_HEIGHT);
  }

  collapseTable(): void {
    this.scrollHeight = this.heightBeforeExpand;
    this.heightBeforeExpand = null;
  }

  isReadOnlyAnswer(header: FormGroupTyped<decisionTable.Header>): boolean {
    return header.controls.section.value === DecisionImplementationTableSections.Answers
      && this.doesOnlyOneAnswerColumnExist()
      && this.decision.answer.answerTypeId !== AnswerType.Other;
  }

  doesOnlyOneAnswerColumnExist(): boolean {
    return this.headersFormArray.controls.filter((item) => item.controls.section.value === DecisionImplementationTableSections.Answers).length === 1;
  }

  getFrozenHeaderHeight(): string {
    const frozenHeaderHeight = this.bottomHeaderRow ? this.bottomHeaderRow.nativeElement.offsetHeight + DEFAULT_HEADER_HEIGHT : TABLE_HEADER_HEIGHT;

    return `${frozenHeaderHeight}px`;
  }

  onTitleHeightChanged(): void {
    setTimeout(() => this.changeDetectorRef.detectChanges());
  }

  checkAnswerHeadersValue(): void {
    if (this.doesOnlyOneAnswerColumnExist() && this.decision.answer.answerTypeId !== AnswerType.Other) {
      this.updateAnswerHeadersValue();
    }
  }

  updateAnswerHeadersValue(): void {
    const singleAnswerColumn = this.headersFormArray.controls.find(
      (item) => item.controls.section.value === DecisionImplementationTableSections.Answers
    );

    this.getDecisionAnswerText().subscribe((answerText) => {
      if (singleAnswerColumn.controls.bottomTitle.value !== answerText) {
        singleAnswerColumn.patchValue({ bottomTitle: answerText });
      }
    });
  }

  getDecisionAnswerText(): Observable<string> {
    return this.decisionAnswerService.getDecisionAnswerPlainText(this.decision.answer);
  }

  createCellId(headerId, cells): string {
    let cellFormGroup;
    cells.controls.forEach(cell => {
      if (cell.value.headerId === headerId)
        cellFormGroup = cell
    });
    return cellFormGroup
  }

  copyCell(e) {
    const selectedCell = document.getElementById(e.item.cell.value.id);
    var range, sel;
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(selectedCell);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(selectedCell);
      sel.addRange(range);
    }
    document.execCommand("copy")
  }

  replaceCellFormGroupToTableForm(rowIndex: number, cellIndex, tempCell: FormGroupTyped<decisionTable.Cell>): void {
    this.rowsFormArray.controls[rowIndex].controls.cells['controls'][cellIndex].patchValue(tempCell.value, { emitEvent: false });
    this.changeDetectorRef.detectChanges();
  }

  pasteCell(e) {
    const rowId = e.item.cell.value.rowId;
    const cellId = e.item.cell.value.id;
    const headerId = e.item.cell.value.headerId;
    const rowIndex = this.rowsFormArray.controls.indexOf(e.item.row);
    const cellIndex = this.rowsFormArray.controls[rowIndex].controls.cells['controls'].indexOf(e.item.cell);

    window.navigator.clipboard.readText()
      .then(text => {
        const tempCell = this.tableService.updateCellFormGroup(rowId, cellId, headerId, text)
        const relationPath =
          `${ObjectRelationsNames.DecisionImplementationTable}/${this.decision.decisionImplementationTable.id}/`
          + `${ObjectRelationsNames.Rows}/${e.item.row.value.id}/`
          + `${ObjectRelationsNames.Cells}/${e.item.cell.value.id}`;
        const body = { text: text } as decisionTable.Cell;
        this.dispatchUpdateAction(body, relationPath);
        this.replaceCellFormGroupToTableForm(rowIndex, cellIndex, tempCell)
      })
  }

  ngOnDestroy() { }
}
