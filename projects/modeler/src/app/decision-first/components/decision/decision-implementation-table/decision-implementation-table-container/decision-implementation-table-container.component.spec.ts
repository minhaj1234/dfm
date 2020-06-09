import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'core/testing';
import { FormGroupTyped } from 'core/utilities';
import { Guid } from 'guid-typescript';
import { DmsThemeModule } from '../../../../../theme';
import { Answer, AnswerType, Decision } from '../../../../models/decision.model';
import { DecisionImplementationTable,DecisionImplementationTableSections } from '../../../../models/decisionImplementationTable.model';
import * as decisionTable from '../../../../models/decisionImplementationTable.model';
import { DecisionAnswerService } from '../../../../services';
import * as fromModelerStore from '../../../../store';
import { TestStoreModule } from '../../../../testing/test-store-module.spec';
import { DecisionImplementationTableService } from '../decision-implementation-table-service/decision-implementation-table.service';
import { MIN_SCROLL_HEIGHT, TABLE_CONTAINER_HEADER_HEIGHT, TABLE_HEADER_HEIGHT } from '../decision-implementation-table.const';
import { DecisionImplementationTableContainerComponent } from './decision-implementation-table-container.component';

describe('DecisionImplementationTableContainerComponent', () => {
  let component: DecisionImplementationTableContainerComponent;
  let fixture: ComponentFixture<DecisionImplementationTableContainerComponent>;
  let tableService: DecisionImplementationTableService;
  let store: Store<fromModelerStore.IDecisionFirstState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DecisionImplementationTableContainerComponent,
        MockComponent({ 
          selector: 'dfm-decision-implementation-table-cell', 
          inputs: ['formControlName', 'isReadOnly', 'cellType', 'text', 'heightChanged'], 
          outputs: ['textChange'] 
        }, true),
        MockComponent({ 
          selector: 'dfm-decision-implementation-table-container', 
          inputs: ['isReadOnly', 'formControlName', 'decision'], 
          outputs: ['expand'] 
        }, true),
        MockComponent({ selector: 'dfm-decision-answer', inputs: ['isReadOnly', 'decision', 'displayOnlyAnswerValueMode']}),
      ],
      imports: [
        DmsThemeModule, 
        FormsModule, 
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        TestStoreModule,
      ],
      providers: [DecisionImplementationTableService, FormBuilder, DecisionAnswerService, DatePipe, ChangeDetectorRef]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    spyOn(Guid , 'create').and.returnValue('newId' as any);

    fixture = TestBed.createComponent(DecisionImplementationTableContainerComponent);
    component = fixture.componentInstance;
    tableService = TestBed.get(DecisionImplementationTableService);
    component.decision = getTestDecision(getTestRows(), getTestHeaders());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('contextMenu', () => {    
    describe('doesRemoveColumnMenuItemVisible', () => {
      it('should return true if numbers of coumls is greater than 1', () => {
        const header = new FormGroup({section: new FormControl(DecisionImplementationTableSections.Conditions)}) as any;
  
        const result = component.doesRemoveColumnMenuItemVisible({header} as any);
  
        expect(result).toBeTruthy();
      });
  
      it('should return false if numbers of coumls is less than 1', () => {
        const header = new FormGroup({section: new FormControl(DecisionImplementationTableSections.Comments)}) as any;
  
        const result = component.doesRemoveColumnMenuItemVisible({header} as any);
  
        expect(result).toBeFalsy();
      });
  
      it('should return false if there are not header in contextMenuSubject', () => {
        const result = component.doesRemoveColumnMenuItemVisible({} as any);
  
        expect(result).toBeFalsy();
      });
    });
  
    describe('doesAddColumnMenuItemVisible ', () => {
      it('should return true if there is header in contextMenuSubject', () => {
        const result = component.doesAddColumnMenuItemVisible ({header: {}} as any);
  
        expect(result).toBeTruthy();
      });
  
      it('should return false if there is not header in contextMenuSubject', () => {
        const result = component.doesAddColumnMenuItemVisible ({} as any);
  
        expect(result).toBeFalsy();
      });
    });
  
    describe('doesAddRowMenuItemVisible ', () => {
      it('should return true if there is row in contextMenuSubject', () => {
        const result = component.doesAddRowMenuItemVisible ({row: {}} as any);
  
        expect(result).toBeTruthy();
      });
  
      it('should return false if there is not row in contextMenuSubject', () => {
        const result = component.doesAddRowMenuItemVisible ({} as any);
  
        expect(result).toBeFalsy();
      });
    });
  
    describe('doesRemoveRowMenuItemVisible ', () => {
      it('should return true if number of rows is greater than 1', () => {
        const result = component.doesRemoveRowMenuItemVisible  ({row: {}} as any);
  
        expect(result).toBeTruthy();
      });
  
      it('should return false if there is not row in contextMenuSubject', () => {
        const result = component.doesRemoveRowMenuItemVisible  ({} as any);
  
        expect(result).toBeFalsy();
      });
  
      it('should return false if there is not row in contextMenuSubject', () => {
        component.decision.decisionImplementationTable.rows = [getTestRows()[0]];
  
        const result = component.doesRemoveRowMenuItemVisible  ({} as any);
  
        expect(result).toBeFalsy();
      });
    });
  });

  describe('updatetable', () => {
    describe('updateHeadersDiff', () => {     
      describe('addMissingHeaders', () => {
        beforeEach(() => {
          component.decision = getTestDecision(getTestRows(), [getTestHeaders()[0], getTestHeaders()[2], getTestHeaders()[3], getTestHeaders()[4]]);
        });   

        it('should add missing headers', () => {
          const initialRowsIds = component.currentTable.headers.map((header) => header.id);
          component.decision = getTestDecision(getTestRows(), getTestHeaders());
          const updatedRowsIds = component.currentTable.headers.map((header) => header.id);
    
          expect(initialRowsIds).toEqual(['column1', 'column3', 'column4', 'column5']);
          expect(updatedRowsIds).toEqual(['column1', 'column2', 'column3', 'column4', 'column5']);
        });
      });

      describe('deleteExtraHeaders', () => {
        it('should delete extra headers', () => {
          const initialRowsIds = component.currentTable.headers.map((header) => header.id);
          component.decision = getTestDecision(getTestRows(), [getTestHeaders()[0], getTestHeaders()[2], getTestHeaders()[3]]);
          const updatedRowsIds = component.currentTable.headers.map((header) => header.id);
    
          expect(initialRowsIds).toEqual(['column1', 'column2', 'column3', 'column4', 'column5']);
          expect(updatedRowsIds).toEqual(['column1', 'column3', 'column4']);
        });
      });
  
      describe('updateHeaders', () => {   
        beforeEach(() => {
          component.decision = getTestDecision(getTestRows(), [getTestHeaders()[0], getTestHeaders()[2], getTestHeaders()[3]]);
        });   
        
        it('should update headers', () => {
          const newHeader: decisionTable.Header = {...getTestHeaders()[3], topTitle: 'new title'};
          component.decision = getTestDecision(getTestRows(), [getTestHeaders()[0], getTestHeaders()[1], getTestHeaders()[2], newHeader]);
          const updatedHeader = component.headersFormArray.getRawValue()
            .find((header: decisionTable.Header) => header.id === getTestHeaders()[3].id);
    
          expect(updatedHeader).toEqual(newHeader);
        });
    
        it('should not change headers if headers are not changed', () => {
          const initialHeaders = component.headersFormArray.getRawValue();
          component.decision = getTestDecision(getTestRows(), [getTestHeaders()[0], getTestHeaders()[2], getTestHeaders()[3]]);
          const headersValueAfterUpdate = component.headersFormArray.getRawValue();
    
          expect(initialHeaders).toEqual(headersValueAfterUpdate);
        });
      });
    });

    describe('updateRowsDiff', () => {  
      describe('addMissingRows', () => {
        beforeEach(() => {
          component.decision = getTestDecision([getTestRows()[0]], getTestHeaders());
        });  

        it('should add missing rows', () => {
          const initialRowsIds = component.currentTable.rows.map((row) => row.id);
          component.decision = getTestDecision(getTestRows(), getTestHeaders());
          const updatedRowsIds = component.currentTable.rows.map((row) => row.id);
    
          expect(initialRowsIds).toEqual(['row1']);
          expect(updatedRowsIds).toEqual(['row1', 'row2']);
        });
      });

      describe('deleteExtraRows', () => {       
        it('should delete extra rows', () => {
          const initialRowsIds = component.currentTable.rows.map((row) => row.id);
          component.decision = getTestDecision([getTestRows()[0]], getTestHeaders());
          const updatedRowsIds = component.currentTable.rows.map((row) => row.id);

          expect(initialRowsIds).toEqual(['row1', 'row2']);
          expect(updatedRowsIds).toEqual(['row1']);
        });
      });

      describe('updateRow', () => {
        describe('updateCell', () => {       
          it('should update cell', () => {
            const newRows: decisionTable.Row[] = [getTestRows()[0]];
            newRows[0].cells[0].text = 'new text'; 
            const newDecision = getTestDecision(newRows, getTestHeaders());
            component.decision = newDecision;
            
            expect(newDecision.decisionImplementationTable).toEqual(component.tableForm.getRawValue());
          });
          
          it('should not change cells if there are not changes', () => {
            const initialTable: DecisionImplementationTable = component.tableForm.getRawValue();
            component.decision = getTestDecision(getTestRows(), getTestHeaders());
            const TableAfterUpdate: DecisionImplementationTable = component.tableForm.getRawValue();
            
            expect(initialTable).toEqual(TableAfterUpdate);
          });     
        });

        describe('updateRowOwnProperties', () => {       
          it('should update row own properties', () => {
            const newRows: decisionTable.Row[] = [getTestRows()[0]];
            newRows[0].order = newRows[0].order + 1; 
            const newDecision = getTestDecision(newRows, getTestHeaders());
            component.decision = newDecision;
            
            expect(newDecision.decisionImplementationTable).toEqual(component.tableForm.getRawValue());
          });
        });
      });
    });
  });

  describe('addColumnBefore', () => {
    beforeEach(() => {
      component.decision = getTestDecision(getTestRows(), getTestHeaders());
    });

    it('should add column before target column', () => {
      const targetColumnIndex = 1;
      const targetColumn = findHeader(getTestHeaders()[targetColumnIndex].id);
      
      const initialHeadersIds = component.currentTable.headers.map((row) => row.id);
      component.addColumnBefore({ item: {header: targetColumn}});
      const updatedHeadersIds = component.currentTable.headers.map((row) => row.id);

      expect(initialHeadersIds).toEqual(['column1', 'column2', 'column3', 'column4', 'column5']);
      expect(updatedHeadersIds).toEqual(['column1', 'newId', 'column2', 'column3', 'column4', 'column5']);
    });
  });

  describe('addColumnAfter', () => {
    it('should add column after target column', () => {
      const targetColumnIndex = 1;
      const targetColumn = findHeader(getTestHeaders()[targetColumnIndex].id);
      
      const initialHeadersIds = component.currentTable.headers.map((row) => row.id);
      component.addColumnAfter({ item: {header: targetColumn}});
      const updatedHeadersIds = component.currentTable.headers.map((row) => row.id);

      expect(initialHeadersIds).toEqual(['column1', 'column2', 'column3', 'column4', 'column5']);
      expect(updatedHeadersIds).toEqual(['column1', 'column2', 'newId', 'column3', 'column4', 'column5']);
    });
  });

  describe('removeColumn', () => {
    it('should remove selected column', () => {
      const removedHeader = findHeader(getTestHeaders()[0].id);
      
      const initialHeadersIds = component.currentTable.headers.map((row) => row.id);
      component.removeColumn({item: {header: removedHeader}});
      const updatedHeadersIds = component.currentTable.headers.map((row) => row.id);

      expect(initialHeadersIds).toEqual(['column1', 'column2', 'column3', 'column4', 'column5']);
      expect(updatedHeadersIds).toEqual(['column2', 'column3', 'column4', 'column5']);
    });
  });

  describe('addRowBefore', () => {
    it('should add row before target row', () => {
      const targetRowIndex = 1;
      const targetRow = component.rowsFormArray.controls.find((row) => row.controls.id.value === getTestRows()[targetRowIndex].id);
      
      const initialRowsIds = component.currentTable.rows.map((row) => row.id);
      component.addRowBefore({ item: {row: targetRow}});
      const updatedRowsIds = component.currentTable.rows.map((row) => row.id);

      expect(initialRowsIds).toEqual(['row1', 'row2']);
      expect(updatedRowsIds).toEqual(['row1', 'newId', 'row2']);
    });
  });
  
  describe('addRowAfter', () => {
    it('should add row after target row', () => {
      const targetRowIndex = 0;
      const targetRow = component.rowsFormArray.controls.find((row) => row.controls.id.value === getTestRows()[targetRowIndex].id);
      
      const initialRowsIds = component.currentTable.rows.map((row) => row.id);
      component.addRowAfter({ item: {row: targetRow}});
      const updatedRowsIds = component.currentTable.rows.map((row) => row.id);

      expect(initialRowsIds).toEqual(['row1', 'row2']);
      expect(updatedRowsIds).toEqual(['row1', 'newId', 'row2']);
    });
  });

  describe('removeRow', () => {
    it('should remove selected row', () => {
      const removedRow = component.rowsFormArray.controls.find((row) => row.controls.id.value === getTestRows()[0].id);
      
      component.removeRow({item: {row: removedRow}});
      const rowsIds = component.currentTable.rows.map((row) => row.id);

      expect(rowsIds).toEqual(['row2']);
    });
  });

  describe('createHeaderWithOrder', () => {
    it(`should create ${DecisionImplementationTableSections.Conditions} header`, () => {
      const header = component.createHeaderFormGroupWithOrder(DecisionImplementationTableSections.Conditions, 1);

      expect(header.controls.section.value).toEqual(DecisionImplementationTableSections.Conditions);
    });

    it(`should create ${DecisionImplementationTableSections.Answers} header`, () => {
      const header = component.createHeaderFormGroupWithOrder(DecisionImplementationTableSections.Answers, 1);

      expect(header.controls.section.value).toEqual(DecisionImplementationTableSections.Answers);
    });

    it(`should create ${DecisionImplementationTableSections.Comments} header`, () => {
      const header = component.createHeaderFormGroupWithOrder(DecisionImplementationTableSections.Comments, 1);

      expect(header.controls.section.value).toEqual(DecisionImplementationTableSections.Comments);
    });
  });

  describe('onResizingDecisionImplementationTableContainer', () => {
    it('should change scroll height', () => {
      const height = MIN_SCROLL_HEIGHT + TABLE_HEADER_HEIGHT;

      component.onResizingDecisionImplementationTableContainer({ rectangle: { height } } as any);

      expect(component.scrollHeight).toEqual(height - TABLE_HEADER_HEIGHT);
    });

    it('should not change scroll height', () => {
      const height = MIN_SCROLL_HEIGHT + TABLE_HEADER_HEIGHT - 1;
      component.scrollHeight = 300;

      component.onResizingDecisionImplementationTableContainer({ rectangle: { height } } as any);

      expect(component.scrollHeight).toEqual(300);
    });
  });

  describe('onExpand', () => {
    it('should call expand event', () => {
      spyOn(component.expand, 'next');

      fixture.debugElement.nativeElement.querySelector('img').click();

      expect(component.expand.next).toHaveBeenCalled();
    });
  });

  
  describe('updateTableHeightAfterExpand', () => {
    beforeEach(() => {
      component.scrollHeight = 300;
      component.tableContainer = { nativeElement: {offsetHeight: 1000}};
    });

    it('should set scrollheight to full container and reduce scrollheight after collapse', () => {
      component.updateTableHeightAfterExpand();

      expect(component.scrollHeight).toEqual(1000 - TABLE_CONTAINER_HEADER_HEIGHT - TABLE_HEADER_HEIGHT);
     
      component.updateTableHeightAfterExpand();

      expect(component.scrollHeight).toEqual(300);
    });
  });

  describe('doDisplayReadOnlyAnswer', () => {
    it('should return true', () => {
      component.decision = getTestDecision(getTestRows(), getTestHeaders(), AnswerType.YesNo);
      component.removeColumn({item: {header: findHeader('column4')}});
      const header = new FormGroup({section: new FormControl(DecisionImplementationTableSections.Answers)}) as FormGroupTyped<decisionTable.Header>;

      const result = component.isReadOnlyAnswer(header);
      
      expect(result).toBeTruthy();
    });

    it('should return false if AnswerType is Other', () => {
      component.decision = getTestDecision(getTestRows(), getTestHeaders(), AnswerType.Other);
      const header = new FormGroup({section: new FormControl(DecisionImplementationTableSections.Answers)}) as FormGroupTyped<decisionTable.Header>;

      const result = component.isReadOnlyAnswer(header);
      
      expect(result).toBeFalsy();
    });

    it('should return false if AnswerType is there are more then 1 answer column', () => {
      component.decision = getTestDecision(getTestRows(), [...getTestHeaders()], AnswerType.YesNo);

      const header = new FormGroup({section: new FormControl(DecisionImplementationTableSections.Answers)}) as FormGroupTyped<decisionTable.Header>;

      const result = component.isReadOnlyAnswer(header);
      
      expect(result).toBeFalsy();
    });
  });

  describe('remove column', () => {
    it('should reset bottomHeader', () => {
      component.decision = getTestDecision(getTestRows(), [...getTestHeaders()], AnswerType.YesNo);
      const removedHeader = findHeader('column4');
    
      component.removeColumn({item: {header: removedHeader}});

      const result = findHeader('column3').controls.bottomTitle.value;
      expect(result).toEqual('resources.yes / resources.no: resources.no');
    });
  });

  function getTestDecision(newRows: decisionTable.Row[], newHeaders: decisionTable.Header[], answerType = AnswerType.Other): Decision {
    const newDecision = new Decision();
    newDecision.decisionImplementationTable = getTestTable();
    newDecision.decisionImplementationTable.headers = newHeaders;
    newDecision.decisionImplementationTable.rows = newRows;
    newDecision.answer = new Answer();
    newDecision.answer.answerTypeId = answerType;

    return newDecision;
  }

  function findHeader(id: string): FormGroupTyped<decisionTable.Header> {
    return component.headersFormArray.controls.find((header) => header.controls.id.value === id)
  }

  function getTestTable() {
    return {
      id: "0354656b-f5c6-31e9-f99c-5b30e5da5e62",
      option: "A",
      headers: getTestHeaders(),
      rows: getTestRows(),
    };
  }

  function getTestRows() {
    return [
      {
        id: "row1",
        order: 1,
        "cells": [
          {rowId: "row1", headerId: "column3", id: "cell5", text: "test3"},
          {rowId: "row1", headerId: "column4", id: "cell6", text: "test4"},
          {rowId: "row1", headerId: "column2", id: "cell7", text: "test2"},
          {rowId: "row1", headerId: "column1", id: "cell8", text: "test1"},
          {rowId: "row1", headerId: "column5", id: "cell10", text: "test1"},
        ]
      },
      {
        "id": "row2",
        "order": 2,
        "cells": [
          {rowId: "row2", headerId: "column3", id: "cell3", text: "test7"},
          {rowId: "row2", headerId: "column4", id: "cell4", text: "test8"},
          {rowId: "row2", headerId: "column1", id: "cell1", text: "test5"},
          {rowId: "row2", headerId: "column2", id: "cell2", text: "test6"},
          {rowId: "row2", headerId: "column5", id: "cell9", text: "test6"},
        ]
      }
    ];
  }

  function getTestHeaders() {
    return [
      {order: 1, topTitle: "Condition 1", bottomTitle: "Allowed Values for 1", id: "column1", section: DecisionImplementationTableSections.Conditions, relatedObjectId: "" },
      {order: 2, topTitle: "Condition 2", bottomTitle: "Allowed Values for 2", id: "column2", section: DecisionImplementationTableSections.Conditions, relatedObjectId: "" },
      {order: 3, topTitle: "Decision Answer", bottomTitle: "Allowed Answers", id: "column3", section: DecisionImplementationTableSections.Answers, relatedObjectId: "" },
      {order: 4, topTitle: "Decision Answer", bottomTitle: "Allowed Answers", id: "column4", section: DecisionImplementationTableSections.Answers, relatedObjectId: "" },
      {order: 5, topTitle: "Messages", bottomTitle: "", id: "column5", section: DecisionImplementationTableSections.Comments, relatedObjectId: "" }
    ]
  }
});
