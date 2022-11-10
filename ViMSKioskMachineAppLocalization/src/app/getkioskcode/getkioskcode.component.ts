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

  _getAllHostList(){
    this.apiServices.localPostMethod('getHostName',{}).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        // this.host_list = JSON.parse(data[0]["Data"]);
        localStorage.setItem('_LIST_OF_HOST', data[0]["Data"]);
        //{"HOSTNAME":"awang","SEQID":225,"COMPANY_REFID":"1","DEPARTMENT_REFID":"","HOSTIC":"awang","HostExt":"","HostFloor":"","HostCardSerialNo":"","HOST_ID":"awang","HOST_EMAIL":"","EMAIL_ALERT":true,"AD_ACTIVE_USER_STATUS":true,"dept_id":null,"dept_desc":null}
        console.log("--- List Of Host Updated");
      }
    },
    err => {
      console.log("Failed...");
      return false;
    });
  }

  takeActFor(action:string){
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
            this.getIconSrc();
          } else{
            document.getElementById("bodyloader").style.display = "none";
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: {title: "Connect to server problem ! please contact admin.", btn_ok:"ตกลง"}
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
                data: {title: "ปรับปรุงคุณสมบัติของคีออสก์ !", btn_ok:"ตกลง"}
              });
              this.router.navigate(['/landing'],{ queryParams: { }});
            } else{
              this.dialog.open(appConfirmDialog, {
                width: '250px',
                data: {title: "ติดปัญหาเซิฟเวอร์ ! โปรดติดต่อผู้ดูแลระบบ", btn_ok:"ตกลง"}
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

  getIconSrc() {
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
              this.callBackSuccess();
            }
          })
          .catch(err => {
            console.error(err);
            downloadCount = downloadCount + 1;
            if (downloadCount === logoSrcs.length) {
              console.log("Call success ->> length:" + logoSrcs.length + " downloadCount:"+ downloadCount);
              this.callBackSuccess();
            }
          });
        }
      } else {
        this.callBackSuccess();
      }
    } else {
      this.callBackSuccess();
    }

  }

  callBackSuccess() {
    this._getAllHostList();
    document.getElementById("bodyloader").style.display = "none";
    console.log("Image download success");
    this.dialog.open(appConfirmDialog, {
      width: '250px',
      data: {title: "ปรับปรุงคุณสมบัติของคีออสก์ !", btn_ok:"ตกลง"}
    });
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
          window.close();
          //window.open('','_self').close();
         }
      });
    }
  }
}
