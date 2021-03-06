import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SettingsService } from 'src/services/settings.service';
import { appConfirmDialog } from '../flow-visitor/flow-visitor.component';
import { DialogAppCommonDialog } from '../app.common.dialog';
import { ApiServices } from 'src/services/apiService';

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
     private apiServices: ApiServices,
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

    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    let setngsPortrait = localStorage.getItem('KIOSK_PROPERTIES_PORT');
    if(setngs != undefined && setngs != "" && !setngsPortrait){
      // document.getElementById("bodyloader").style.display = "block";
      // localStorage.setItem('KIOSK_PROPERTIES_PORT', "true");
      // setTimeout(() => {
      //   this.router.navigateByUrl('/landing');
      //   document.getElementById("bodyloader").style.display = "none";
      // }, 5000);
      this.KIOSK_CODE = localStorage.getItem("APP_KIOSK_CODE");
      // this.takeActFor('update');
      localStorage.clear();
      localStorage.setItem('KIOSK_PROPERTIES_PORT', "true");
      this.UPDATE_SETTINGS_SHOW = true;
      this.takeActFor('update', true);
      // this.router.navigateByUrl('/landing');
    }
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
  takeActFor(action:string, showAlert:boolean){
    if(action === "update"){
      if((this.KIOSK_CODE).toString().length > 0){
        localStorage.setItem("APP_KIOSK_CODE", this.KIOSK_CODE);
        document.getElementById("bodyloader").style.display = "block";
        this.settingServices._verifyKioskMachineCode((status:boolean)=>{
          if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != "" &&
          localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != ""){
            this.UPDATE_SETTINGS_SHOW = false;
          }
          if(status){
            this.getIconSrc(showAlert);
          } else{
            document.getElementById("bodyloader").style.display = "none";
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

  getIconSrc(showAlert) {
    localStorage.setItem('KIOSK_RequestAppointment', '');
    localStorage.setItem('KIOSK_CheckIn', '');
    localStorage.setItem('KIOSK_CheckOut', '');
    localStorage.setItem('KIOSK_MyKad', '');
    localStorage.setItem('KIOSK_IDScanner', '');
    localStorage.setItem('KIOSK_Passport', '');
    localStorage.setItem('KIOSK_BusinessCard', '');
    localStorage.setItem('KIOSK_Appointment', '');
    localStorage.setItem('KIOSK_ManualRegistration', '');
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      const logoSrcs = this.KIOSK_PROPERTIES['commonsetup']['button_background_image'];
      if (logoSrcs && logoSrcs.length > 0) {
        const apiUrl = this.apiServices._getAPIURL() + '/FS/';
        let downloadCount = 0;
        for (let i = 0; i < logoSrcs.length; i++) {
          const locaItem = logoSrcs[i];
          console.log(locaItem.Type + " --> Request Position:" + i);
          this.getBase64ImageFromUrl(apiUrl+ locaItem.imgpathurl)
          .then(result => {
            downloadCount = downloadCount + 1;
            console.log(locaItem.Type + " --> Base64: completed downloadCount:" + downloadCount);
            localStorage.setItem('KIOSK_'+locaItem.Type, result+'');
            if (downloadCount === logoSrcs.length) {
              console.log("Call success ->> length:" + logoSrcs.length + " downloadCount:"+ downloadCount);
              this.callBackSuccess(showAlert);
            }
          })
          .catch(err => {
            console.error(err);
            downloadCount = downloadCount + 1;
            if (downloadCount === logoSrcs.length) {
              console.log("Call success ->> length:" + logoSrcs.length + " downloadCount:"+ downloadCount);
              this.callBackSuccess(showAlert);
            }
          });
        }
      } else {
        this.callBackSuccess(showAlert);
      }
    } else {
      this.callBackSuccess(showAlert);
    }

  }

  callBackSuccess(showAlert) {
    document.getElementById("bodyloader").style.display = "none";
    console.log("Image download success");
    // if (!showAlert){
      this.dialog.open(appConfirmDialog, {
        width: '250px',
        data: {title: "Kiosk Properties Updated !", btn_ok:"Ok"}
      });
    // }
    this.router.navigate(['/landing'],{ queryParams: { }});
  }

  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", () => {
          resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
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
          localStorage.setItem('KIOSK_PROPERTIES_PORT', '');
          window.close();
          //window.open('','_self').close();
         }
      });
    }
  }
}
