import { forwardRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaxTextLengthCategory } from 'core/components';
import { DecisionImplementationTableCellType } from '../../../../models/decisionImplementationTable.model';
import { POPOVER_OPEN_DELAY } from '../decision-implementation-table.const';

@Component({
  selector: 'dfm-decision-implementation-table-cell',
  templateUrl: './decision-implementation-table-cell.component.html',
  styleUrls: ['./decision-implementation-table-cell.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DecisionImplementationTableCellComponent),
      multi: true
    }
  ]
})
export class DecisionImplementationTableCellComponent implements OnInit, ControlValueAccessor  {
  private _isEditable: boolean;
  private _text: string;
  public maxTextLengthCategory = MaxTextLengthCategory
  public popoverOpenDelay = POPOVER_OPEN_DELAY;
  @ViewChild('input', { static: true }) input: ElementRef;
  @ViewChild('textarea', { static: true }) textarea: ElementRef;
  @Output() heightChanged = new EventEmitter<any>();
  @Input() isReadOnly: boolean;
  @Input() cellType: DecisionImplementationTableCellType;
  onChange: any = () => {}
  onTouch: any = () => {}
  @Input()
  set text(value: string) {
    this._text = value;
  }

  get text(): string {
    return this._text;
  }

  get inputField(): ElementRef {
    return this.isBottomTitleType()
      ? this.textarea
      : this.input;
  }

  set isEditable(value: boolean) {
    this._isEditable = value;
    this.heightChanged.emit();
  }

  get isEditable(): boolean {
    return this._isEditable;
  }

  @HostBinding('class.decision-table-top-header')
  get isTopHeader() {
    return this.cellType === DecisionImplementationTableCellType.TopTitle;
  }

  @HostBinding('class.decision-table-bottom-header')
  get isBottomHeader() {
    return this.cellType === DecisionImplementationTableCellType.BottomTitle;
  }

  @HostBinding('class.decision-table-cell')
  get isCell() {
    return this.cellType === DecisionImplementationTableCellType.Cell;
  }

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.isEditable = false;
  }

  writeValue(value: string): void {
    this.text = value;
    setTimeout(() => this.heightChanged.emit());
  }

  onTextChanged(value: string): void {
    this.text = value;
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  onContainerClick(): void {
    if (!this.isReadOnly) {
      this.isEditable = true;
      setTimeout(() =>  this.inputField.nativeElement.focus())
    }
  }

  makeNotEditable(): void {
    this.isEditable = false;
  }

  isBottomTitleType(): boolean {
    return this.cellType === DecisionImplementationTableCellType.BottomTitle;
  }

  getText(): string {
    return this.isBottomTitleType()
      ? this.text.replace(/(\n|\r|\r\n)/g, '<br>')
      : this.text;
  }
}
