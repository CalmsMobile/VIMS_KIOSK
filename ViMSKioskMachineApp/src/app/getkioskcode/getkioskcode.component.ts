import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SettingsService } from 'src/services/settings.service';
import { appConfirmDialog } from '../flow-visitor/flow-visitor.component';
import { DialogAppCommonDialog } from '../app.common.dialog';

@Component({
  selector: 'app-getkioskcode',
  templateUrl: './getkioskcode.component.html',
  styleUrls: ['./getkioskcode.component.scss']
})
export class GetkioskcodeComponent implements OnInit {

  KIOSK_CODE:any;
  KIOSK_AVAL_CARDS:number = 0;
  UPDATE_SETTINGS_SHOW:boolean = true;
  constructor(private router:Router,
     private route: ActivatedRoute,
     private settingServices:SettingsService,
     public snackBar: MatSnackBar,
     private dialog:MatDialog) { 
    this.KIOSK_CODE = localStorage.getItem("APP_KIOSK_CODE") || '';
    if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != ""
    && localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != ""
    && localStorage.getItem("KIOSK_PROPERTIES") != undefined && localStorage.getItem("KIOSK_PROPERTIES") != ""){
      this.UPDATE_SETTINGS_SHOW = false;
    }
    if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != ""
    && localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != "" 
    && localStorage.getItem("KIOSK_PROPERTIES") != undefined && localStorage.getItem("KIOSK_PROPERTIES") != ""){
      document.getElementById("homeButton").style.display = "block"; 
    } else {
      document.getElementById("homeButton").style.display = "none";
    }
    this._updateKioskSettings();
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.KIOSK_CODE = params['scanData'] || localStorage.getItem("APP_KIOSK_CODE") || '';
        if(this.KIOSK_CODE != undefined && this.KIOSK_CODE != ''){
          //this.takeActFor('update');
        }
      });
  }
  takeActFor(action:string){
    if(action === "update"){
      if((this.KIOSK_CODE).toString().length > 0){
        localStorage.setItem("APP_KIOSK_CODE", this.KIOSK_CODE);
        document.getElementById("bodyloader").style.display = "block";
        this.settingServices._verifyKioskMachineCode((status:boolean)=>{
          document.getElementById("bodyloader").style.display = "none";
          if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != "" && 
          localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != ""){
            this.UPDATE_SETTINGS_SHOW = false;
          }
          if(status){
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: {title: "Kiosk Properties Updated !", btn_ok:"Ok"}
            });
            this.router.navigate(['/landing'],{ queryParams: { }});
          } else{
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: {title: "Connect to server problem ! please contact admin.", btn_ok:"Ok"}
            });
          }
        });
      }
    } else if(action === "settingsUpdate"){
      if((this.KIOSK_CODE).toString().length > 0){
        if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != "" && 
          localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != ""){
          this.settingServices._getThisLicenceSetupProperties((status:boolean)=>{
            if(status){
              this.dialog.open(appConfirmDialog, {
                width: '250px',
                data: {title: "Kiosk Properties Updated !", btn_ok:"Ok"}
              });
              this.router.navigate(['/landing'],{ queryParams: { }});
            } else{
              this.dialog.open(appConfirmDialog, {
                width: '250px',
                data: {title: "Connect to server problem ! please contact admin.", btn_ok:"Ok"}
              });
            }
          });
        }
      }
    } else if(action === "clearAccount"){
      const dialogRef = this.dialog.open(DialogAppCommonDialog, {
        width: '250px',
        data: {"title": "Are you sure want to clear this account?", "subTile":"",
        "enbCancel":true,"oktext":"Yes","canceltext":"No"}
      });
  
      dialogRef.afterClosed().subscribe(result => {
         if(result){
          localStorage.clear();
          this.router.navigateByUrl('/landing');
         }
      });
    }
    else if(action === "back"){
      this.router.navigateByUrl('/landing')
    }else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }else if(action === "testing"){
      this.router.navigateByUrl('/testing')
    } else if(action =="scanNow"){
      this.router.navigate(['/scanQRCode'], {queryParams: { scanType: 'LICENCEQR' }});
    }
  }
  textDataBindTemp(value : string, elm:string ) {  
    console.log(value);
    this[elm] = value;
  }
  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES'); 
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.KIOSK_AVAL_CARDS = this.KIOSK_PROPERTIES['kioskAvalCards'];
    }
  }
  closeWindow(action:String){
    // const remote = require('electron').remote;
    // var window = remote.getCurrentWindow();
    if(action === "exit"){
      const dialogRef = this.dialog.open(DialogAppCommonDialog, {
        width: '250px',
        data: {"title": "Are you sure want to exit from App?", "subTile":"",
        "enbCancel":true,"oktext":"Yes","canceltext":"No"}
      });
  
      dialogRef.afterClosed().subscribe(result => {
         if(result){
          window.close();
          //window.open('','_self').close();
         }
      });
    }
  }
}
