import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { SettingsService } from 'src/services/settings.service';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';
import {Location} from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppSettings } from 'src/services/app.settings';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
  sub:any;
  action:any = '';
  isLoading:boolean = false;
  isFinished:boolean = false;
  LOGO_IMG = "assets/images/cus_icons/icon_rightyes.png";
  TEST_PIN:any = "";
  RESULT_MSG = "";
  RESULT_MSG2 = "";
  RESULT_MSG3 = "";
  AVAL_VISITORS:any = [];
  mainModule = '';
  CURRENT_VISTOR_CHCKIN_DATA_FOR_PRINT:any;
  EnableAcsQrCode:any = false;
  CheckInVisitorData:any=[];
  DisplayImageHandlerURL = '';
  attendanceData: any = {};
  imageURLType = '&RefType=VPB&Refresh='+ new Date().getTime();
  checkindisplayTime = '';
  constructor(private route: ActivatedRoute,
    private settingsService:SettingsService,
    public datePipe:DatePipe,
    private _location: Location,
    private domSanitizer: DomSanitizer,
    private dialog:MatDialog,
     private router:Router, private apiServices:ApiServices) {
    this.isLoading = false;
    this.TEST_PIN = "";
    this.getImageHandlerURL();
  }
  ngOnInit() {
    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
    this._updateKioskSettings();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        const attendanceData1 = params['data'] || "";
        if(attendanceData1){
          this.attendanceData = JSON.parse(attendanceData1);
          this.checkindisplayTime = this.attendanceData.att_check_in_date.split('T')[0] + ' ' + this.attendanceData.att_check_in_time.split('T')[1];

        }
      });
  }
  takeActFor(action:string){
    if(action === "home"){
      this.router.navigateByUrl('/landing');
    }
  }
  getImageHandlerURL() {
    this.DisplayImageHandlerURL = JSON.parse(localStorage.getItem('APP_KIOSK_CODE_DECRIPTED')).ApiUrl+'Handler/ImageHandler.ashx?RefSlno='+'';
  }
  processNexttoSuccess() {
    let _timeout = this.KIOSK_PROPERTIES['commonsetup']['timer']['tq_scr_timeout_msg'] || 5;
    _timeout = parseInt(_timeout) * 1000;
    setTimeout(()=>{
      this.router.navigateByUrl('/landing');
    },_timeout);
  }

  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }

  callApitoCheckout() {
    this.isLoading = true;
    var params = {
      "att_id":this.attendanceData.att_id,
      "remarks": '',
      "CheckOutCounter":"KOISK"
    };

    console.log(JSON.stringify(params));

    var _callErrorMsg = ()=>{
      this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkout']['out_sccess_msg1'] ;
      const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
        data: {"title": this.KIOSK_PROPERTIES['modules']['only_visitor']['checkout']['out_sccess_msg2'], "subTile":"Please try again or Contact Reception" }
      });
      dialogRef.afterClosed().subscribe((data)=>{
        this.router.navigateByUrl('/landing');
      });
    }

    var _callErrorMsg1 = (desc)=>{
      this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkout']['out_sccess_msg1'] ;
      const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
        data: {"title": this.KIOSK_PROPERTIES['modules']['only_visitor']['checkout']['out_sccess_msg2'], "subTile": desc }
      });
      dialogRef.afterClosed().subscribe((data)=>{
        this.router.navigateByUrl('/landing');
      });
    }

  this.apiServices.localPostMethod("VimsAppUpdateVisitorCheckOut", params).subscribe((data:any) => {
    console.log(data);
    if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
      let _RETdata = data[0]["Data"];
      if(_RETdata){
        let output = JSON.parse(_RETdata) || [];
        console.log(output);
        if(output){
          if(output.Table != undefined &&  output.Table.length > 0){
            if(output.Table[0].Code == 10) {
              this.isFinished = true;
              this._finish_with_success_msg();
            } else {
              _callErrorMsg1(output.Table[0].Description? output.Table[0].Description: output.Table[0].description);
            }

          }else if(output.length > 0 && (output[0].code > 10 || output[0].Code > 10)){
            _callErrorMsg1(output[0].Description? output[0].Description: output[0].description);
          }else{
            _callErrorMsg();
          }
        }else{
          if(data[0] && data[0].ErrorLog && data[0].ErrorLog[0] && data[0].ErrorLog[0].Error) {
            _callErrorMsg1(JSON.stringify({"message":data[0].ErrorLog[0].Error}));
          } else {
            _callErrorMsg();
          }
        }
      }
    } else{
      _callErrorMsg();
      return false;
    }
  } ,
  err => {
    _callErrorMsg();
    return false;
  });
}

  private _finish_with_success_msg(){
    this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkout']['out_sccess_msg1'] ;
    // this.RESULT_MSG2 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkout']['out_sccess_msg2'] ;

    let _timeout = this.KIOSK_PROPERTIES['commonsetup']['timer']['tq_scr_timeout_msg'] || 5;
    _timeout = parseInt(_timeout) * 1000;
    setTimeout(()=>{
      this.isLoading = false;
      this.router.navigateByUrl('/landing');
    },_timeout);

  }
}

@Component({
  selector: 'dialog-visitor-already-exist',
  template: `
        <h1 mat-dialog-title margin>{{data.title}}</h1>
        <h2 mat-dialog-title margin style="margin-bottom: 3vw !important;">{{data.subTile}}</h2>
        <div mat-dialog-actions margin>
          <button mat-raised-button my-theme-button
          style="margin: auto;"
          [mat-dialog-close]="true" cdkFocusInitial> {{data.ok || 'OK'}}</button>
        </div>`,
})
export class DialogSuccessMessagePage {

  constructor(
    public dialogRef: MatDialogRef<DialogSuccessMessagePage>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
