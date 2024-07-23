import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conform-popup',
  templateUrl: './conform-popup.component.html',
  styleUrl: './conform-popup.component.css'
})
export class ConformPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConformPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
