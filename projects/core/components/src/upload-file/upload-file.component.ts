import { forwardRef, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'core-upload-file',
  styleUrls: ['./upload-file.component.scss'],
  templateUrl: './upload-file.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true,
    },
  ],
})
export class UploadFileComponent implements ControlValueAccessor {
  private onChange: any;
  private onTouch: any;
  fileToUpload: File;
  @Input() accept: string;

  writeValue(file: File): void { 
    this.fileToUpload = file;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onFileSelected(files: FileList): void {
    if (files.length) {
      this.fileToUpload = files[0];
      this.onChange(files[0])
    } 
  }
}
