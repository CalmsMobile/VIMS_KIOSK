import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-barcode-verification',
  templateUrl: './barcode-verification.component.html',
  styleUrls: ['./barcode-verification.component.scss']
})
export class BarcodeVerificationComponent implements OnInit {
  id = "";
  @ViewChild('barcodeInput') barcodeInput: ElementRef;
  constructor(private router: Router, private dialog: MatDialog,) {
    setTimeout(() => {
      this.barcodeInput.nativeElement.focus();
    });

  }

  ngOnInit() {

  }
  takeActFor(action) {
    if (action == 'cancel')
      this.router.navigateByUrl('/landing');
  }
  textDataBindTemp(value: string) {
    console.log(value);
  }
  onKeydown(event) {
    console.log(event);
    if (event.key === "Enter") {
      console.log(event);
      if (this.id != "" && this.id.length == 9) {
        let isAlpha = /^[a-zA-Z]+$/;
        let isNum = /^\d+$/;
        this.id = this.id;
        if (isAlpha.test(this.id[0]) && isAlpha.test(this.id[this.id.length - 1]) && isNum.test(this.id.substring(1, 8))) {
          console.log("onInput " + this.id)
          this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: 'OTHER', SGID: this.id.substring(5, 9).toUpperCase() } });
        } else {
          this.retryAlert();
        }
      } else
        this.retryAlert();
    }
  }
  onInput(value: string) {
    console.log(value.length)
    this.id = value;
    /* if (value != "" && value.length == 9) {
      let isAlpha = /^[a-zA-Z]+$/;
      let isNum = /^\d+$/;
      this.id = value;
      if (isAlpha.test(this.id[0]) && isAlpha.test(this.id[this.id.length - 1]) && isNum.test(this.id.substring(1, 8))) {
        console.log("onInput " + value)
        this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: 'OTHER', SGID: value.substring(5, 9) } });
      } else {
        this.retryAlert();
      }
    } */
  }
  retryAlert() {
    const dialogRef = this.dialog.open(DialogRetry, {
      data: { "title": "Alert!" },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((data) => {
      setTimeout(() => {
        this.barcodeInput.nativeElement.value = "";
        this.barcodeInput.nativeElement.focus();
      });
    });
  }
}
@Component({
  selector: 'dialog-visitor-already-exist',
  template: `
        <h1 mat-dialog-title margin>{{data.title}}</h1>
        <h2 mat-dialog-title margin style="margin-bottom: 1vw !important;">Invalid document, please scan valid Id.</h2>
        <h2 mat-dialog-title margin style="margin-bottom: 3vw !important;">Do you want to try again now?</h2>
        <div mat-dialog-actions margin>
          <button mat-raised-button my-theme-button
          style="margin: auto;"
          [mat-dialog-close]="true" cdkFocusInitial>Retry</button>
          <button mat-raised-button my-theme-button
          style="margin: auto;"
          [mat-dialog-close]="true" (click)="gotoHome()">No</button>
        </div>`,
})
export class DialogRetry {

  constructor(
    public dialogRef: MatDialogRef<DialogRetry>,
    @Inject(MAT_DIALOG_DATA) public data, private router: Router) { }

  gotoHome() {
    this.router.navigateByUrl('/landing');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
