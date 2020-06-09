import { forwardRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImplementationComponentIcon } from 'core/objects/implementation-component/models';
import { getSvgBase64String } from 'core/utilities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dfm-implementation-component-select-icon',
  styleUrls: ['./implementation-component-select-icon.component.scss'],
  templateUrl: './implementation-component-select-icon.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImplementationComponentSelectIconComponent),
      multi: true,
    },
  ],
})
export class ImplementationComponentSelectIconComponent implements OnDestroy, ControlValueAccessor {
  @Input() icons: ImplementationComponentIcon[];
  @Input() isReadOnly: boolean;
  @Output() selectIconClick = new EventEmitter<any>();
  private _selectedIconId: string;
  get selectedIconId(): string {
    return this._selectedIconId;
  }
  set selectedIconId(iconId: string) {
    this._selectedIconId = iconId;
    this.onChange(iconId);
  }

  private onChange: any = () => {};
  private onTouch: any = () => {};

  constructor(
    private domSanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef,
  ) { }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(iconId: string): void {
    this._selectedIconId = iconId;
    this.changeDetector.markForCheck();
  }

  trackByFn(index: number, icon: ImplementationComponentIcon): string {
    return icon.id;
  }

  getSelectedIcon(): ImplementationComponentIcon {
    return this.icons.find((icon) => icon.id === this.selectedIconId);
  }

  getSelectedIconSafeResourceUrl(): SafeResourceUrl {
    const selectedIcon = this.getSelectedIcon();

    return this.transformToSafeSvgResourceUrl(selectedIcon);
  }

  getSelectedIconTooltip(): string {
    const selectedIcon = this.getSelectedIcon();

    return selectedIcon ? selectedIcon.tooltip : '';
  }

  transformToSafeSvgResourceUrl(icon: ImplementationComponentIcon): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(getSvgBase64String(icon ? icon.base64 : ''));
  }

  onSelectIcon(iconId: string): void {
    this.selectedIconId = iconId;
  }

  onSelectIconClick(): void {
    this.selectIconClick.emit();
  }

  ngOnDestroy() { }
}
