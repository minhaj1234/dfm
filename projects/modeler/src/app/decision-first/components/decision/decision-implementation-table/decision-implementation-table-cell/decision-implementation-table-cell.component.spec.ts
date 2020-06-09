import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { getDebugElement } from 'core/testing';
import { DmsThemeModule } from '../../../../../theme';
import { DecisionImplementationTableCellType } from '../../../../models/decisionImplementationTable.model';
import { DecisionImplementationTableCellComponent } from './decision-implementation-table-cell.component';

describe('DecisionTableCellComponent', () => {
  let component: DecisionImplementationTableCellComponent;
  let fixture: ComponentFixture<DecisionImplementationTableCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionImplementationTableCellComponent ],
      imports: [FormsModule, DmsThemeModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionImplementationTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onContainerClick', () => {
    it('should make editable', () => {
      const container = fixture.debugElement.nativeElement.querySelector('.decision-table-cell-text-container');

      container.click();

      expect(component.isEditable).toBeTruthy();
    });
  });

  describe('makeNotEditable', () => {
    it('should make not editable', () => {
      component.isEditable = true;

      component.makeNotEditable();

      expect(component.isEditable).toBeFalsy();
    });
  });

  describe('onTextChanged', () => {
    it('should call onChange when input event is emitted', () => {
      spyOn(component, 'onChange');
      component.writeValue('text');
      const inputElement = getDebugElement(fixture, '.decision-table-cell-input').nativeElement;
      inputElement.value = 'new value';
      inputElement.dispatchEvent(new Event('input'));

      expect(component.onChange).toHaveBeenCalledWith('new value');
    });
  });

  describe('isBottomTitleType', () => {
    it('should return true', () => {
      component.cellType = DecisionImplementationTableCellType.BottomTitle;

      const result = component.isBottomTitleType();

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      component.cellType = DecisionImplementationTableCellType.Cell;

      const result = component.isBottomTitleType();

      expect(result).toBeFalsy();
    });
  });

  describe('getText', () => {
    it('should convert to html if cell type is BottomTitle', () => {
      component.cellType = DecisionImplementationTableCellType.BottomTitle;
      component.writeValue('t\ne\nx\nt'); 

      const text = component.getText();

      expect(text).toEqual('t<br>e<br>x<br>t');
    });

    it('should return text if cell type is not BottomTitle', () => {
      component.cellType = DecisionImplementationTableCellType.Cell;
      component.writeValue('te<br>xt'); 

      const text = component.getText();

      expect(text).toEqual('te<br>xt');
    });
  });

  describe('inputField', () => {
    it('should return textarea elementRef', () => {
      component.cellType = DecisionImplementationTableCellType.BottomTitle;

      const elementRef = component.inputField;

      expect(elementRef).toEqual(component.textarea);
    });

    it('should return textarea elementRef', () => {
      component.cellType = DecisionImplementationTableCellType.Cell;
      
      const elementRef = component.inputField;

      expect(elementRef).toEqual(component.input);
    });
  });
});
