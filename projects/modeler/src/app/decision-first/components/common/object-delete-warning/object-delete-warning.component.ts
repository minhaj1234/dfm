import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'dfm-object-delete-warning',
  templateUrl: './object-delete-warning.component.html',
  styleUrls: ['./object-delete-warning.component.scss']
})
export class ObjectDeleteWarningComponent {

  permanentDelete: boolean;

  constructor(
    private dialogRef: NbDialogRef<ObjectDeleteWarningComponent>
  ) { }

  deleteObjectFromDrd() {
    this.permanentDelete = false;
    this.dialogRef.close(this.permanentDelete)
  }

  deleteObjectPermanently() {
    this.permanentDelete = true;
    this.dialogRef.close(this.permanentDelete)
  }

}
