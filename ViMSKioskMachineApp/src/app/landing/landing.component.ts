import { AppSettings } from './../../../../ViMSKioskMachineAppLocalization/src/services/app.settings';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ApiServices } from 'src/services/apiService';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SettingsService } from 'src/services/settings.service';
import { DialogAppCommonDialog } from '../app.common.dialog';
import { DialogSuccessMessagePage } from '../flow-visitor/appointment-success/appointment-success.component';
import { DialogPrepareForScanComponent } from '../flow-visitor/registration-type/registration-type.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  //@ViewChild('readStaffCard') readStaffCardElement: ElementRef;
  LOGO_IMG = "assets/images/cus_icons/CALMS_logo.png";
  GO_SETTINGS_COUNT: number = 0;
  KIOSK_AVAL_CARDS: number = 0;
  GO_SETTINGS_TIMER: any = null;
  IF_CONNECT_WITH_SERVER: boolean = false;
  StaffCardNo: any = '';
  Appointment = '';
  RequestAppointment = '';
  CheckIn = '';
  CheckOut = '';
  KIOSK_PROPERTIES_LOCAL: any = {};
  KIOSK_TYPE: string;
  constructor(
    private apiServices: ApiServices,
    private settingsServices: SettingsService,
    private datePipe: DatePipe,
    private elRef: ElementRef,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) {

    this._clearAllLocalData();
    this._updateKioskSettings();
  }
  ngOnInit() {
    /* localStorage.setItem("TemperatureMessageTitle", this.KIOSK_PROPERTIES['General']['TemperatureMessageTitle']);
    localStorage.setItem("Temperature", this.KIOSK_PROPERTIES['General']['AllowedTemperatureLimit']);
    localStorage.setItem("WaitMessage", this.KIOSK_PROPERTIES['General']['WaitMessage']); */
    console.log("%c ---------- Landing Screen Init: %s", AppSettings.LOG_SUCCESS, this.datePipe.transform(new Date(), 'medium'));


  }
  ngAfterViewInit() {
    document.getElementById("homeButton").style.display = "none";
    this.getConfigData();
    //checkWebsocket();
  }

  getConfigData() {
    this.apiServices.getConfigFile()
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          const item = JSON.stringify(JSON.parse(data));
          localStorage.setItem('KIOSK_PROPERTIES_LOCAL', item);
        }
        // this.KIOSK_PROPERTIES.LOCAL_DATA = JSON.parse(data);
        // localStorage.setItem('KIOSK_PROPERTIES_LOCAL', JSON.stringify(JSON.parse(data)));
      });
  }

  ngOnDestroy() {
    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
    document.getElementById("homeButton").style.display = "block";
    //console.log("%c ---------- Landing Screen Distroy: %s", AppSettings.LOG_FAILED, this.datePipe.transform(new Date(), 'medium'));
  }
  readStaffCardEnter() {
    const StaffCardValue = this.StaffCardNo;
    this.StaffCardNo = "";
    if (StaffCardValue != "") {
      this.apiServices.getStaffInfo({ "StaffCardNo": StaffCardValue }).subscribe((data: any) => {
        if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
          let Data = JSON.parse(data[0]["Data"]);
          if (Data["Table"] != undefined) {
            if (Data["Table"].length > 0 && Data["Table"][0]['code'] == "S") {
              if (Data["Table1"].length > 0) {
                localStorage.setItem("HOSTNAME", Data["Table1"][0]['HOSTNAME']);
                localStorage.setItem("HOSTIC", Data["Table1"][0]['HOSTIC']);
                localStorage.setItem("ServerTime", Data["Table1"][0]['ServerTime']);
                localStorage.setItem("ComPort", this.KIOSK_PROPERTIES['General']["TemperatureDevicePort"]);
                localStorage.setItem("WaitMessage", this.KIOSK_PROPERTIES['General']['WaitMessage']);
                this.router.navigateByUrl('/staffDetailForTemp');
              }
            }
            else {
              this.snackBar.open(Data["Table"][0]['description'], "", { duration: 2000 });
            }
          }
          else {
            this.snackBar.open("Unknown error", "", { duration: 2000 });
          }
        }
      }, err => { });
    }
  }
  takeActFor(action: string) {
    if (action === "staff") {
      //this.router.navigateByUrl('/staffFlow');
    } else if (action === "visitor") {
      //this.router.navigateByUrl('/visitorAgree');
    } else if (action === "vcheckin") {

      localStorage.setItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE, action);
      this.checkCardPosition((status: boolean) => {
        if (status) {
          if (this.KIOSK_PROPERTIES['WalkinSettings']['T_and_C']['enable']) {
            this.router.navigateByUrl('/visitorAgree');
          } else {
            this.router.navigateByUrl('/visitorRegisType');
            /* if (this.KIOSK_PROPERTIES['General']['EnableTemperatureSetting'])
              this.router.navigateByUrl('/visitorDetailForTemp');
            else {
              console.log('button clicked:' + action)
              if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license) &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
                const _imgsrc = "assets/images/cus_icons/id_lic_gif.gif";

                const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                  width: '250px',
                  disableClose: false,
                  data: {
                    "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_title),
                    "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_msg),
                    "scanImage": _imgsrc,
                    "cancel": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_cancel_txt),
                    "ok": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_ok_txt)
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: 'SING_NRICrDRIV' } });
                  } else {
                    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
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
                  disableClose: false,
                  data: {
                    "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_title),
                    "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_msg),
                    "scanImage": _imgsrc,
                    "cancel": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_cancel_txt),
                    "ok": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_ok_txt)
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: 'PASSPORT' } });
                  } else {
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
                  disableClose: false,
                  data: {
                    "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_title),
                    "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_msg),
                    "scanImage": _imgsrc,
                    "cancel": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_cancel_txt),
                    "ok": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_screen_scan_alert_ok_txt)
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: 'BUSINESS' } });
                  } else {
                    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                  }
                });
              } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
                this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual && action === 'vcheckin') {
                this.router.navigate(['/visitorPreApontmnt'], { queryParams: { docType: 'PREAPPOINTMT' } });
              } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
                this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: 'OTHER' } });
              } else {
                this.router.navigateByUrl('/visitorRegisType');
              }
            } */
          }
        }
      });
    } else if (action == 'vcheckinapproval') {
      localStorage.setItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE, action);
      this.checkCardPosition((status: boolean) => {
        if (status) {
          if (this.KIOSK_PROPERTIES['ReqApptSettings']['T_and_C']['enable']) {
            this.router.navigateByUrl('/visitorAgree');
          } else {
            this.router.navigateByUrl('/visitorRegisType');
            /* if (this.KIOSK_PROPERTIES['General']['EnableTemperatureSetting'])
              this.router.navigateByUrl('/visitorDetailForTemp');
            else {
              console.log('button clicked:' + action)
              if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Driving_license) &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Passport &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_manual) {
                const _imgsrc = "assets/images/cus_icons/id_lic_gif.gif";

                const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                  width: '250px',
                  disableClose: false,
                  data: {
                    "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_title),
                    "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_msg),
                    "scanImage": _imgsrc,
                    "cancel": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_cancel_txt),
                    "ok": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_ok_txt)
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: 'SING_NRICrDRIV' } });
                  } else {
                    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                  }
                });
              } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_NRIC &&
                this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Passport &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Driving_license &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_manual) {
                const _imgsrc = "assets/images/cus_icons/id_passport_gif.gif";

                const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                  width: '250px',
                  disableClose: false,
                  data: {
                    "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_title),
                    "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_msg),
                    "scanImage": _imgsrc,
                    "cancel": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_cancel_txt),
                    "ok": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_ok_txt)
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: 'PASSPORT' } });
                  } else {
                    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                  }
                });
              } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_NRIC &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Passport &&
                this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Driving_license &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_manual) {
                const _imgsrc = "assets/images/cus_icons/id_business_gif.gif";

                const dialogRef = this.dialog.open(DialogPrepareForScanComponent, {
                  width: '250px',
                  disableClose: false,
                  data: {
                    "title": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_title),
                    "subTile": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_msg),
                    "scanImage": _imgsrc,
                    "cancel": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_cancel_txt),
                    "ok": (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_screen_scan_alert_ok_txt)
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    this.router.navigate(['/visitorDocScanRLoading'], { queryParams: { docType: 'BUSINESS' } });
                  } else {
                    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
                  }
                });
              } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_NRIC &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Passport &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Busins_Card &&
                !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_Driving_license &&
                this.KIOSK_PROPERTIES.modules.only_visitor.checkin.appt_manual) {
                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: 'OTHER' } });
              } else {
                this.router.navigateByUrl('/visitorRegisType');
              }
            } */
          }
        }
      });
    } else if (action === "preAppointment") {
      //debugger
      localStorage.setItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE, action);
      this.checkCardPosition((status: boolean) => {
        if (status) {
          if (this.KIOSK_PROPERTIES['AppointmentSettings']['T_and_C']['enable']) {
            this.router.navigateByUrl('/visitorAgree');
          } else {
            this.router.navigate(['/visitorPreApontmnt'], { queryParams: { docType: "PREAPPOINTMT" } });
          }
        }
      });

    } else if (action === "vcheckout") {
      this.router.navigateByUrl('/visitorCheckout');
    }
  }
  _clearAllLocalData() {
    localStorage.setItem("_PURPOSE_OF_VISIT", "[]");
    localStorage.setItem("VISI_SCAN_DOC_DATA", "");
    localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", "");
    localStorage.setItem("VISI_HOST_MOB_NUM", "");
    localStorage.setItem("VISI_LIST_ARRAY", "{\"appSettings\":{}, \"visitorDetails\" :[]}");
  }
  gotoCountClickSettings() {
    let numOfClicks = 8;
    this.GO_SETTINGS_COUNT++;
    if (this.GO_SETTINGS_TIMER != null) {
      clearTimeout(this.GO_SETTINGS_TIMER);
    }
    this.GO_SETTINGS_TIMER = setTimeout(() => {
      this.GO_SETTINGS_COUNT = 0;
      console.log("Click Cleared;")
    }, 2000);
    if (this.GO_SETTINGS_COUNT === numOfClicks) {
      this.GO_SETTINGS_COUNT = 0;
      clearTimeout(this.GO_SETTINGS_TIMER);
      this.snackBar.dismiss();
      document.getElementById("bodyloader").style.display = "none";
      this.router.navigateByUrl('/getKioskCode');
    }
    if (this.GO_SETTINGS_COUNT > 5 && this.GO_SETTINGS_COUNT < numOfClicks) {
      this.snackBar.open("Need " + (numOfClicks - this.GO_SETTINGS_COUNT) + " more clicks go to Settings", "", { duration: 2000 });
    }
  }

  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    let kioskType = localStorage.getItem('KIOSK_TYPE');
    if (kioskType != undefined) {
      this.KIOSK_TYPE = kioskType;
    }
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.LOGO_IMG = this.KIOSK_PROPERTIES['commonsetup']['company_logo'];
      let app_bg = this.KIOSK_PROPERTIES['commonsetup']['app_background'];
      document.querySelector("body[app-bg]")['style']['background'] = "url('" + app_bg + "') no-repeat center";
      this.composeRunTimeCss();
      if (this.KIOSK_PROPERTIES.WalkinSettings.card_dispenser.enable || this.KIOSK_PROPERTIES.AppointmentSettings.card_dispenser.enable) {
        this.KIOSK_AVAL_CARDS = this.KIOSK_PROPERTIES['kioskAvalCards'];
        document.getElementById("bodyloader").style.display = "block";
        this.apiServices.localGetMethod("GetMACAddress", "").subscribe((data: any) => {
          document.getElementById("bodyloader").style.display = "none";
          let MacDetails = data;
          if (MacDetails.length > 0 && MacDetails[0]['Status'] === true) {
            let MAC_ID = MacDetails[0]['Data'];
            localStorage.setItem("MY_MAC_ID", MAC_ID);
            // document.getElementById("bodyloader").style.display = "block";
            this.settingsServices._kiosk_getAvalCards((status, cards) => {
              // document.getElementById("bodyloader").style.display = "none";
              if (status) {
                this.IF_CONNECT_WITH_SERVER = true;
                this.KIOSK_AVAL_CARDS = cards;
                if (setngs != undefined && setngs != "") {
                  setngs = JSON.parse(setngs);
                  setngs['kioskAvalCards'] = cards;
                  localStorage.setItem('KIOSK_PROPERTIES', JSON.stringify(setngs));
                }
              } else {
                this.dialog.open(DialogAppCommonDialog, {
                  width: '350px',
                  disableClose: true,
                  data: { title: "Connect to server problem ! please contact admin.", subTile: "", enbCancel: false, canceltext: "", oktext: "OK" }
                });
              }
            });
          }
        },
          err => {
            document.getElementById("bodyloader").style.display = "none";
            this.router.navigateByUrl('/getKioskCode');
            return false;
          });
      } else {
        this.IF_CONNECT_WITH_SERVER = true;
      }
    } else {
      this.router.navigateByUrl('/getKioskCode');
    }
  }
  composeRunTimeCss() {
    let setngs_local = localStorage.getItem('KIOSK_PROPERTIES_LOCAL');
    this.KIOSK_PROPERTIES_LOCAL = JSON.parse(setngs_local);
    let shadow = "0px 0px 0px 4px white";
    let round_border_color = this.KIOSK_PROPERTIES['commonsetup']['clr_btn_gtd_2'];
    if (!this.KIOSK_PROPERTIES['commonsetup']['Enable_Round_border_button']) {
      round_border_color = "#6633ff00"
      shadow = "none"
    }

    this.Appointment = localStorage.getItem('KIOSK_Appointment');
    this.RequestAppointment = localStorage.getItem('KIOSK_RequestAppointment');
    this.CheckIn = localStorage.getItem('KIOSK_WalkinRegistration');
    this.CheckOut = localStorage.getItem('KIOSK_CheckOut');
    const MyKad = localStorage.getItem('KIOSK_MyKad');
    const KIOSK_IDScanner = localStorage.getItem('KIOSK_IDScanner');
    const KIOSK_Passport = localStorage.getItem('KIOSK_Passport');
    const KIOSK_BusinessCard = localStorage.getItem('KIOSK_BusinessCard');
    const KIOSK_Appointment = localStorage.getItem('KIOSK_Appointment');
    const KIOSK_ManualRegistration = localStorage.getItem('KIOSK_ManualRegistration');
    console.log("apply image css ->>" + this.CheckIn);
    let _css = `
    [welcome-title] { color: ` + this.KIOSK_PROPERTIES['commonsetup']['clr_txt_header1'] + ` !important; }
    [info-title] { color: ` + this.KIOSK_PROPERTIES['commonsetup']['clr_txt_header2'] + ` !important; }
    [sub-title] { color: ` + this.KIOSK_PROPERTIES['commonsetup']['clr_txt_header2'] + ` !important; }
    [my-theme-round-button], [my-theme-button] {
      color: ` + this.KIOSK_PROPERTIES['commonsetup']['clr_btn_txt'] + ` !important;
      background: linear-gradient(to top left, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_btn_gtd_2'] + `, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_btn_gtd_1'] + `) !important;
    }
    [my-theme-round-button]::before, [my-theme-button]::before {
      box-shadow: `+ shadow + ` !important;
    }
    [sp-button-red-in], [sp-button-red-out],[sp-button-green-in], [sp-button-green-out],[sp-button-violet-out],[sp-button-violet-in],
    [sp-button-rose-in], [sp-button-rose-out],[sp-button-yellow-in], [sp-button-yellow-out],[sp-button-blue-in],[sp-button-blue-out]
    {
      color: ` + this.KIOSK_PROPERTIES['commonsetup']['kiosk_button_text_color'] + ` !important;
      background: transparent !important;
      box-shadow: none !important;
      border: 5px solid ` + round_border_color + `;
      border-radius: 60px !important;
    }
    [sp-button-red-out1], [sp-button-green-out1], [sp-button-violet-out1], [sp-button-green-out1] {
      color: ` + this.KIOSK_PROPERTIES['commonsetup']['kiosk_button_text_color'] + ` !important;
      background: transparent !important;
      box-shadow: none !important;
      border: 5px solid ` + round_border_color + `;
      border-radius: 60px !important;
    }
    [theme-border-input-big],
    [theme-border-input-small]{
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_input_color'] + ` !important;
    }
    [theme-border-input-big].mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label,
    [theme-border-input-small].mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_input_caption'] + ` !important;
    }
    [theme-border-input-small].mat-form-field-appearance-outline .mat-form-field-label,
    [theme-border-input-small].mat-form-field-appearance-outline .mat-form-field-label{
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_input_caption'] + ` !important;
    }
    [my-reg-option-btn]{
      color: ` + this.KIOSK_PROPERTIES['commonsetup']['clr_txt_header1'] + ` !important;
    }
    [my-reg-option-radio]{
      color: ` + this.KIOSK_PROPERTIES['commonsetup']['clr_txt_header1'] + ` !important;
    }
    [my-reg-option-radio][value="MYCARD"]::before {
      background: url(` + (MyKad ? MyKad : 'assets/images/cus_icons/my_card.png') + `) no-repeat !important;
      background-size: 50% !important;
      background-position: center 28% !important;
    }
    [my-reg-option-radio][value="SING_NRICrDRIV"]::before {
      background: url(` + (KIOSK_IDScanner ? KIOSK_IDScanner : 'assets/images/cus_icons/driving_card.png') + `) no-repeat !important;
      background-size: 50% !important;
      background-position: center 28% !important;
    }
    [my-reg-option-radio][value="PASSPORT"]::before {
      background: url(` + (KIOSK_Passport ? KIOSK_Passport : 'assets/images/cus_icons/passport.png') + `) no-repeat !important;
      background-size: 50% !important;
      background-position: center 28% !important;
    }
    [my-reg-option-radio][value="BUSINESS"]::before {
      background: url(` + (KIOSK_BusinessCard ? KIOSK_BusinessCard : 'assets/images/cus_icons/business_card.png') + `) no-repeat !important;
      background-size: 50% !important;
      background-position: center 28% !important;
    }
    [my-reg-option-radio][value="PREAPPOINTMT"]::before {
      background: url(` + (KIOSK_Appointment ? KIOSK_Appointment : 'assets/images/cus_icons/pre_appointment.png') + `) no-repeat !important;
      background-size: 50% !important;
      background-position: center 28% !important;
    }
    [my-reg-option-radio][value="OTHER"]::before {
      background: url(` + (KIOSK_ManualRegistration ? KIOSK_ManualRegistration : 'assets/images/cus_icons/manual_keyboard.png') + `) no-repeat !important;
      background-size: 50% !important;
      background-position: center 28% !important;
    }
    .mat-badge-content{
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_btn_txt'] + ` !important;
      background: linear-gradient(to top left, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_btn_gtd_2'] + `, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_btn_gtd_1'] + `) !important;
    }
    virtual-keyboard .mat-fab.mat-primary,
    virtual-keyboard .mat-flat-button.mat-primary,
    virtual-keyboard .mat-mini-fab.mat-primary,
    virtual-keyboard .mat-raised-button.mat-primary {
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_txt'] + ` !important;
      background: linear-gradient(to top left, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_gtd_2'] + `, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_gtd_1'] + `) !important;
    }
    virtual-keyboard [mat-mini-fab] mat-icon,
    virtual-keyboard [mat-mini-fab] mat-icon:hover{
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_txt'] + ` !important;
    }
    .hg-theme-default .hg-button {
      color:` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_txt'] + ` !important;
      background: linear-gradient(to top left, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_gtd_2'] + `, ` + this.KIOSK_PROPERTIES['commonsetup']['clr_keyboard_btn_gtd_1'] + `) !important;
      font-size: large!important;
    }
    `;
    document.getElementById("MY_RUNTIME_CSS").innerHTML = _css;
  }


  checkCardPosition(_callback) {
    _callback(true)
  }
}
/* function checkWebsocket() {
  //throw new Error('Function not implemented.');
  try {
    const _this = this;
    //const readyState = new Array("on connection", "Connection established", "Closing connection", "Close connection");
    var host = AppSettings.APP_DEFAULT_SETTIGS.SinosecureWebsocketUrl;

    _this.websocket = new WebSocket(host);
    debugger
    if (_this.websocket.readyState == 1 || _this.websocket.readyState == 2) {
      debugger
      _this.websocket.onclose = function () {
        debugger
        console.log('close state' + _this.websocket.readyState);
      }
    }
  } catch (exception) {
    debugger
    console.log("Websocket erroe");
  }
} */

