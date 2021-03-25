import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { AppSettings} from "../../../services/app.settings";
import {MatSnackBar, MatDialog} from '@angular/material';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';
import { DialogPrepareForScanComponent } from '../registration-type/registration-type.component';

@Component({
  selector: 'app-visitorTemperature',
  templateUrl: './visitorTemperature.component.html',
  styleUrls: ['./visitorTemperature.component.scss']
})
export class visitorTemperatureComponent implements OnInit {
  VM:any = {
   "Temperature":"",
   "TempTitle":"",
   "MaxTemperature":37.00
  }
  KIOSK_PROPERTIES: any;
  constructor(private router:Router,
    private apiServices:ApiServices,
    public snackBar: MatSnackBar,
    private dialog:MatDialog,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.VM.TempTitle=localStorage.getItem("TemperatureMessageTitle");
    this.VM.Temperature=(localStorage.getItem("Temperature")!=""?parseFloat(localStorage.getItem("Temperature")):0.00);
    if(this.VM.Temperature>this.VM.MaxTemperature){
      const dialogRef = this.dialog.open(DialogAppCommonDialog, {
        disableClose:true,
        data: {"title": "Please contact administrator/reception?", "subTile":"Fever temperature not premitted to enter building",
        "enbCancel":false,"oktext":"Ok","canceltext":""}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigateByUrl('/landing');
      });
    }
    else{
      let setngs = localStorage.getItem('KIOSK_PROPERTIES');
      if(setngs != undefined && setngs != ""){
        this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      }
      setTimeout(() => {
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
      }, 2000);
    }
  }
  ngOnDestroy() {
  }
}
