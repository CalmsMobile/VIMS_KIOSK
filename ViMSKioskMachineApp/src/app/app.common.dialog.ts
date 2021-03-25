import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
    selector: 'dialog-app-common-dialog',
    template: `
          <h1 mat-dialog-title margin-top>{{data.title}}</h1>
          <h2 mat-dialog-title margin-top style="margin-bottom: 3vw;">{{data.subTile}}</h2>
          <div mat-dialog-actions margin>
            <button *ngIf="data.enbCancel" style="margin:0px 4vw 0px auto"
            mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > {{data.canceltext}}</button>
            <button mat-raised-button my-theme-button [mat-dialog-close]="true" 
            style="margin:0px auto;" 
            cdkFocusInitial> {{data.oktext}}</button>
          </div>`,
  })
  export class DialogAppCommonDialog {
  
    constructor(
      public dialogRef: MatDialogRef<DialogAppCommonDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }