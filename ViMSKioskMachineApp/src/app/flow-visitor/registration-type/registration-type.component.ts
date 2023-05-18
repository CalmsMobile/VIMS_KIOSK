import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';
export interface DialogData {
  title: string;
  subTile: string;
  scanImage: string;
  ok: string;
  cancel: string;
}
@Component({
  selector: 'app-registration-type',
  templateUrl: './registration-type.component.html',
  styleUrls: ['./registration-type.component.scss']
})
export class RegistrationTypeComponent implements OnInit {

  SEL_REGISTRATION_TYPE: any = '';
  totalVisitors: number = 0;
  mainModule = '';
  constructor(private router: Router, private dialog: MatDialog, private apiServices: ApiServices) {
    this.SEL_REGISTRATION_TYPE = '';
    localStorage.setItem("VISI_SCAN_DOC_DATA", "");
    let getVisi = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    this.totalVisitors = getVisi['visitorDetails'].length;
    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
    this._updateKioskSettings();
  }

  ngOnInit() {
    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
  }
  takeActFor(action: string) {
    if (action === "back") {
      if (this.KIOSK_PROPERTIES.COMMON_CONFIG.T_and_C.enable) {
        this.router.navigateByUrl('/visitorAgree');
      } else {
        this.router.navigateByUrl('/landing');
      }
    } else if (action === "next") {
      this.openPrepareScanDocDialog();
    } else if (action === "home") {
      this.router.navigateByUrl('/landing');
    } else if (action === "visitorSummary") {
      this.router.navigateByUrl('/visitorSummaryDetail')
    }
  }
  regTypeChangeEvent(event: any) {
    console.log(event.value + this.SEL_REGISTRATION_TYPE);
    setTimeout(() => { this.takeActFor("next"); }, 100)

  }
  openPrepareScanDocDialog(): void {
    if (this.SEL_REGISTRATION_TYPE == 'SING_NRICrDRIV' ||
      this.SEL_REGISTRATION_TYPE == 'PASSPORT' || this.SEL_REGISTRATION_TYPE == 'MYCARD'
      || this.SEL_REGISTRATION_TYPE == 'BUSINESS') {
      let _imgsrc = "assets/images/cus_icons/id_passport_gif.gif";
      let title = "";
      let subTile = "";
      let cancel_btn = "";
      let proceed_btn = "";

      if (this.SEL_REGISTRATION_TYPE == 'SING_NRICrDRIV') {
        _imgsrc = "assets/images/cus_icons/id_lic_gif.gif";
        title = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRICRLicense_ScanGuide;
        //subTile = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRICRLicense_ScanGuide;
        cancel_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRICRLicense_cancel_button_caption;
        proceed_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRICRLicense_proceed_button_caption;

      } else if (this.SEL_REGISTRATION_TYPE == 'PASSPORT') {
        _imgsrc = "assets/images/cus_icons/id_passport_gif.gif";
        title = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_ScanGuide;
        //subTile = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_ScanGuide;
        cancel_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_cancel_button_caption;
        proceed_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_proceed_button_caption;

      } else if (this.SEL_REGISTRATION_TYPE == 'MYCARD') {
        _imgsrc = "assets/images/cus_icons/id_mycard_gif.gif";
        title = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRIC_ScanGuide;
        //subTile = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRIC_ScanGuide;
        cancel_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRIC_cancel_button_caption;
        proceed_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRIC_proceed_button_caption;

      } else if (this.SEL_REGISTRATION_TYPE == 'BUSINESS') {
        _imgsrc = "assets/images/cus_icons/id_business_gif.gif";
        title = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.BusinessCard_ScanGuide;
        //subTile = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.BusinessCard_ScanGuide;
        cancel_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.BusinessCard_cancel_button_caption;
        proceed_btn = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.BusinessCard_proceed_button_caption;

      }
      const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
        width: '250px',
        disableClose: false,
        data: {
          "title": (title),
          "subTile": (subTile),
          "scanImage": _imgsrc,
          "cancel": (cancel_btn),
          "ok": (proceed_btn)
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: this.SEL_REGISTRATION_TYPE } });
        } else { }
      });
    } else if (this.SEL_REGISTRATION_TYPE == 'OTHER') {
      this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.SEL_REGISTRATION_TYPE } });
    }
  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      if (this.mainModule === 'vcheckin') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.WalkinSettings;
      } else {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.ReqApptSettings;
      }
    }
  }
}
@Component({
  selector: 'dialog-mobile-verify-dialog',
  template: `
        <h2 mat-dialog-title margin-top>{{data.title}}</h2>
        <h2 mat-dialog-title margin-top style="margin-bottom: 3vw;">{{data.subTile}}</h2>
        <div margin-bottom style="text-align:center">
          <img [src]="data.scanImage" style="height: 15vw;" margin-bottom/>
        </div>
        <div mat-dialog-actions margin>
          <button mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > {{data.cancel}}</button>
          <button mat-raised-button my-theme-button [mat-dialog-close]="true"> {{data.ok}}</button>
        </div>`,
})
export class DialogPrepareForScanComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogPrepareForScanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
