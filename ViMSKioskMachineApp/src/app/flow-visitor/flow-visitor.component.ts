import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog,MatTabsModule } from '@angular/material';
import { DialogPrepareForScanComponent } from './registration-type/registration-type.component';
import { AppSettings} from '../../services/app.settings';

@Component({
  selector: 'app-flow-visitor',
  templateUrl: './flow-visitor.component.html',
  styleUrls: ['./flow-visitor.component.scss']
})
export class FlowVisitorComponent implements OnInit {
  sub:any;
  needHostNumber:any = '';
  totalVisitors:number = 0;
  mainModule = '';
  constructor(
    private apiServices:ApiServices,
    private router:Router,
    public dialog: MatDialog,
    private route: ActivatedRoute) {
      let getVisi = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
      this.totalVisitors =  getVisi['visitorDetails'].length;
      this._updateKioskSettings();
    }
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.needHostNumber = params['needHostNumber'] || '';
      });
  }

  takeActFor(action:string){
    if(action === "agree"){

      this.router.navigateByUrl('/visitorRegisType');
     /*  if(this.KIOSK_PROPERTIES['General']['EnableTemperatureSetting'])
        this.router.navigateByUrl('/visitorDetailForTemp');
      else {

        if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license) &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            const _imgsrc = "assets/images/cus_icons/id_lic_gif.gif";

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
               // this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
              }
            });
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            const _imgsrc = "assets/images/cus_icons/id_passport_gif.gif";
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
                //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
              }
            });
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            const _imgsrc = "assets/images/cus_icons/id_business_gif.gif";

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
                //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
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

          if(localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE) === "preAppointment"){
            localStorage.setItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE, 'vcheckin');
            this.router.navigate(['/visitorPreApontmnt'], {queryParams: { docType: "PREAPPOINTMT" }});
          }else{
            this.router.navigateByUrl('/visitorRegisType');
          }

        }
      } */

    } else if(action === "visitorSummary"){
      this.router.navigateByUrl('/visitorSummaryDetail')
    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }

  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      if (this.mainModule === 'vcheckin') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.WalkinSettings;
      } else if (this.mainModule === 'vcheckinapproval'){
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.ReqApptSettings;
      }else if (this.mainModule === 'preAppointment'){
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.AppointmentSettings;
      }
    }
  }
}
@Component({
  selector: 'app-terms-and-condition',
  templateUrl: '../../assets/tandc.html'
})
export class AppTermsAndCondtion {}

@Component({
  selector: 'dialog-app-common-dialog',
  template: `
  <h1 mat-dialog-title style="margin:30px;">{{data.title}}</h1>
  <div mat-dialog-content>
  </div>
  <div mat-dialog-actions margin text-center>
      <button style="margin:0px auto;" *ngIf="data.btn_ok != ''" mat-raised-button my-theme-button [mat-dialog-close]="true">
        {{data.btn_ok}}
        <span style="    margin-left: 15px;
        font-size: 4vh;
        padding: 2px 10px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        margin-bottom: 10px;">{{count}}</span>
      </button>
  </div>`
})
export class appConfirmDialog {

  count:any;
  constructor(
    public dialogRef: MatDialogRef<appConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.count = 5;
      var myInterval = setInterval(()=>{
        this.count--;
        if(this.count === 0){
          clearInterval(myInterval);
          this.dialogRef.close(true);
        }
      },1000);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
