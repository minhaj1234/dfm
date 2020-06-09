export class DecisionImplementationTable {
  id: string;
  option: string;
  headers: Header[];
  rows: Row[];
}

export class Header {
  id: string;
  topTitle: string;
  bottomTitle: string;
  order: number;
  section: DecisionImplementationTableSections;
  relatedObjectId: string;
}

export class Row {
  id: string;
  order: number;
  cells: Cell[];
}

export class Cell {
  id: string;
  text: string;
  headerId: string;
  rowId: string;
}

export class Rows {
  "rows": [{
    "id": string,
    "cells": Array<{ 'id': string, 'text': string }>
  }
  ]
}

export type TableEntity =
  | Row
  | Header
  | Cell
  | Rows
  | DecisionImplementationTable

export enum DecisionImplementationTableSections {
  Conditions = 'Conditions',
  Answers = 'Answers',
  Comments = 'Comments',
}

export enum DecisionImplementationTableCellType {
  TopTitle,
  BottomTitle,
  Cell
}

export class AddHeaderRequestBody {
  id: string;
  topTitle: string;
  bottomTitle: string;
  order: number;
  section: DecisionImplementationTableSections;
  relatedObjectId: string;
  rows: Row[];
}

export type AddEntityRequestBody =
  | AddHeaderRequestBody
  | Row