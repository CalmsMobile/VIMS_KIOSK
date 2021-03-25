import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppSettings} from '../../../services/app.settings';
import { DialogPrepareForScanComponent } from '../registration-type/registration-type.component';
import { ApiServices } from 'src/services/apiService';
export interface DialogData {
  title: string;
  subTile: string;
}
@Component({
  selector: 'app-host-mobile',
  templateUrl: './host-mobile.component.html',
  styleUrls: ['./host-mobile.component.scss']
})
export class HostMobileComponent implements OnInit {
  KIOSK_PROPERTIES: any;
  HOST_MOB_NUMBER:any;
  totalVisitors:number = 0;
  LOGO_IMG = "assets/images/cus_icons/smartphone.png";
  _COUNTRYCODE = AppSettings.APP_DEFAULT_SETTIGS.COUNTRY_PHONE_CODE;
  constructor(private router:Router, public dialog: MatDialog, private apiServices: ApiServices) {
    this.HOST_MOB_NUMBER = '';
    localStorage.setItem("VISI_HOST_MOB_NUM","");
    let getVisi = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    this.totalVisitors =  getVisi['visitorDetails'].length;
  }

  ngOnInit() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
  takeActFor(action:string){
    if(action === "back"){
      this.router.navigateByUrl('/visitorAgree')
    } else if(action === "next"){
      this.openMobileVerifyDialog();
    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    } else if(action === "visitorSummary"){
      this.router.navigateByUrl('/visitorSummaryDetail')
    }
  }
  openMobileVerifyDialog(): void {
    const dialogRef = this.dialog.open(DialogMobileVerifyComponent, {
      width: '250px',
      data: {"title": "Please Confirm the host mobile number", "subTile":this.HOST_MOB_NUMBER }
    });

    dialogRef.afterClosed().subscribe(result => {
       if(result){
        localStorage.setItem("VISI_HOST_MOB_NUM",this.HOST_MOB_NUMBER );
        {
          if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license) &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
              const _imgsrc = "assets/images/cus_icons/id_lic_gif.gif";
              this.apiServices.localGetMethod("setLEDON",
              this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_NRICRLicense_LED_port']).subscribe((ledStatus:any) => {},err=>{});

              const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                width: '250px',
                disableClose:false,
                data: {
                  "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_title),
                  "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_msg),
                  "scanImage":_imgsrc,
                  "cancel":(this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_cancel_txt),
                  "ok":(this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_ok_txt)
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                if(result){
                    this.router.navigate(['/visitorDocScanRLoading'],{ queryParams: { docType: 'SING_NRICrDRIV' }});
                } else{
                  this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                }
              });
          } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
            this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
              const _imgsrc = "assets/images/cus_icons/id_passport_gif.gif";
              this.apiServices.localGetMethod("setLEDON",
              this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_Passport_LED_port']).subscribe((ledStatus:any) => {},err=>{});

              const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                width: '250px',
                disableClose:false,
                data: {
                  "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_title),
                  "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_msg),
                  "scanImage":_imgsrc,
                  "cancel":(this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_cancel_txt),
                  "ok":(this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_ok_txt)
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                if(result){
                    this.router.navigate(['/visitorDocScanRLoading'],{ queryParams: { docType: 'PASSPORT' }});
                } else{
                  this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                }
              });
          } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
            this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
              const _imgsrc = "assets/images/cus_icons/id_business_gif.gif";
              this.apiServices.localGetMethod("setLEDON",
              this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_Busins_Card_LED_port']).subscribe((ledStatus:any) => {},err=>{});

              const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                width: '250px',
                disableClose:false,
                data: {
                  "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_title),
                  "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_msg),
                  "scanImage":_imgsrc,
                  "cancel":(this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_cancel_txt),
                  "ok":(this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_ok_txt)
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                if(result){
                    this.router.navigate(['/visitorDocScanRLoading'],{ queryParams: { docType: 'BUSINESS' }});
                } else{
                  this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                }
              });
          } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
            this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
              this.router.navigate(['/visitorPreApontmnt'], {queryParams: { docType: 'PREAPPOINTMT' }});
          } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
            !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
            this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
              this.router.navigate(['/visitorAppointmentDetail'], {queryParams: { docType: 'OTHER' }});
          } else {
            this.router.navigateByUrl('/visitorRegisType');
          }
        }
       }
    });
  }
  textDataBindTemp(value : string, elm:string ) {
    console.log(value);
    this[elm] = value;
  }
}
@Component({
  selector: 'dialog-mobile-verify-dialog',
  template: `
        <h2 mat-dialog-title margin-top>{{data.title}}</h2>
        <h1 mat-dialog-title margin-top style="margin-bottom: 3vw;">{{_COUNTRYCODE}} {{data.subTile}}</h1>
        <div mat-dialog-actions margin>
          <button mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > Cancel</button>
          <button mat-raised-button my-theme-button [mat-dialog-close]="true" cdkFocusInitial> Confirm</button>
        </div>`,
})
export class DialogMobileVerifyComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogMobileVerifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    _COUNTRYCODE = AppSettings.APP_DEFAULT_SETTIGS.COUNTRY_PHONE_CODE;
  onNoClick(): void {
    this.dialogRef.close();
  }

}
