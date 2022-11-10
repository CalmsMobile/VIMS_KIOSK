import { Component, Inject, HostListener, ElementRef } from '@angular/core';
import { ApiServices } from '../services/apiService';
import { SettingsService } from '../services/settings.service';
import { AppSettings} from "../services/app.settings";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar, MatBottomSheet } from '@angular/material';
import {DialogAppCommonDialog} from './app.common.dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {Clipboard} from "electron";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  myClipBoard: Clipboard;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      //console.log("clicked inside");
      this.stillIamLive();
    } else {
      //console.log("clicked outside");
      this.stillIamLive();
    }
  }
  constructor(
    private eRef: ElementRef,
    private apiServices:ApiServices,
    private settingsService:SettingsService,
    private router:Router,
    public snackBar: MatSnackBar,
    private datePipe:DatePipe,
    private bottomSheet: MatBottomSheet,
    private dialog:MatDialog){
    if(localStorage.getItem("APP_DEFAULT_SETTIGS") == undefined || localStorage.getItem("APP_DEFAULT_SETTIGS") == ""){
      localStorage.setItem("APP_DEFAULT_SETTIGS", JSON.stringify(AppSettings['APP_DEFAULT_SETTIGS']));
    }
    this.TIMEOUT_COUNTER = 0;
    this.TIMEOUT_UPDATE_INTERVAL = null;
  }
  public takeActForApp(action:string){
    switch (action){
      case 'home':
      const dialogRef = this.dialog.open(DialogAppCommonDialog, {
        //width: '250px',
        data: {"title": "คุณแน่ใจหรือว่าต้องการกลับบ้าน", "subTile":"",
        "enbCancel":true,"oktext":"ตกลง","canceltext":"ยกเลิก"}
      });
      dialogRef.afterClosed().subscribe(result => {
         if(result){
           console.log("Result",result)
          this.router.navigateByUrl('/landing');
         } else{
          console.log("Result",result)

         }
      });
      break;
    }
  }
  ngOnInit() {
    // this._verifyKioskMachineCode();
    console.log("%c ---------- App Component Init: %s", AppSettings.LOG_SUCCESS, this.datePipe.transform(new Date(), 'medium'));
  }
  ngOnDestroy() {
    console.log("%c ---------- App Component Distroy: %s", AppSettings.LOG_FAILED, this.datePipe.transform(new Date(), 'medium'));
  }
  TIMEOUT_UPDATE_INTERVAL:any = null;
  TIMEOUT_COUNTER:any = 0;
  stillIamLive(){
    console.log("%c -------- Hi i still live .." + this.router.url,  AppSettings.LOG_SUCCESS);
    this.TIMEOUT_COUNTER = 0;
    clearInterval(this.TIMEOUT_UPDATE_INTERVAL);
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
    if(this.KIOSK_PROPERTIES['commonsetup'] != undefined){
      if(this.router.url != "/landing"){
        if(this.KIOSK_PROPERTIES['commonsetup']['timer']['scr_timeout'] > 0){
          this.TIMEOUT_UPDATE_INTERVAL = setInterval(()=>{
            this.TIMEOUT_COUNTER ++;
            if(this.KIOSK_PROPERTIES['commonsetup']['timer']['scr_timeout'] > 0){
              if(this.TIMEOUT_COUNTER == (this.KIOSK_PROPERTIES['commonsetup']['timer']['scr_timeout'])){
                this.TIMEOUT_COUNTER = 0;
                clearInterval(this.TIMEOUT_UPDATE_INTERVAL);
                this.gotoLandingScreen();
              }
            }
          },1000);
        }
      }
    }

  }
  gotoLandingScreen(){
    if(this.router.url != "/landing"){
      const dialogRef = this.dialog.open(DialogAppSessionTimeOutDialog, {
        //width: '250px',
        data: {
          "title": this.KIOSK_PROPERTIES['commonsetup']['timer']['timout_msg_title'],
          "subTile": this.KIOSK_PROPERTIES['commonsetup']['timer']['timout_msg_msg'],
          "enbCancel":true,
          "oktext":this.KIOSK_PROPERTIES['commonsetup']['timer']['timeout_btn_continue_label'],
          "canceltext":this.KIOSK_PROPERTIES['commonsetup']['timer']['timeout_btn_gohome_label']
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log("%c ---------- User Continue Session: %s", AppSettings.LOG_SUCCESS, this.datePipe.transform(new Date(), 'medium'));
          this.stillIamLive();

        } else{
          console.log("%c ---------- User Session Closed: %s", AppSettings.LOG_FAILED, this.datePipe.transform(new Date(), 'medium'));
          try {
            this.dialog.closeAll();
            this.bottomSheet.dismiss();
          } catch (error) {

          }
          this.router.navigateByUrl('/landing');
        }
      });
    }
  }

  KIOSK_PROPERTIES:any = {};
  _verifyKioskMachineCode(){
    if(localStorage.getItem("APP_KIOSK_CODE") == undefined || localStorage.getItem("APP_KIOSK_CODE") == ""){
      localStorage.setItem("APP_KIOSK_CODE", "");
      this.router.navigateByUrl('/getKioskCode');
    }
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];

    //-------------------- Hardware Services --------------------
      this.settingsService._initCardDispenserModule();
    }
  }
}

@Component({
  selector: 'dialog-app-common-dialog',
  template: `
        <h2 mat-dialog-title margin-top>{{data.title}}</h2>
        <h1 mat-dialog-title margin-top style="margin-bottom: 3vw;">{{getMessage()}}.</h1>
        <div mat-dialog-actions margin>
          <button *ngIf="data.enbCancel" style="margin:0px 4vw 0px auto"
          mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > {{data.canceltext}}</button>
          <button mat-raised-button my-theme-button [mat-dialog-close]="true"
          style="margin:0px auto;" cdkFocusInitial> {{data.oktext}}</button>
        </div>`,
})
export class DialogAppSessionTimeOutDialog {
  timeOutCount:number = 0;
  KIOSK_PROPERTIES:any = {};
  constructor(
    public dialogRef: MatDialogRef<DialogAppSessionTimeOutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(localStorage.getItem("APP_KIOSK_CODE") != undefined || localStorage.getItem("APP_KIOSK_CODE") != ""){
        let setngs = localStorage.getItem('KIOSK_PROPERTIES');
        if(setngs != undefined && setngs != ""){
          this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
        }
      }
      this.timeOutCount = parseInt(this.KIOSK_PROPERTIES['commonsetup']['timer']['scr_timeout_msg']);
      setInterval(()=>{
        this.timeOutCount--;
        if(this.timeOutCount === 0){
          this.dialogRef.close(false);
        }
      },1000);
    }

    getMessage() {
      if(this.data.subTile) {
        return this.data.subTile.replace("{{timeOutCount}}", (this.timeOutCount + ' '));
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
