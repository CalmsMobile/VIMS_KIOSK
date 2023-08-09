import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/services/app.settings';
import { ApiServices } from 'src/services/apiService';
import { MatSnackBar, MatDialog } from '@angular/material';
import { appConfirmDialog } from '../flow-visitor.component';
@Component({
  selector: 'app-scan-rloading',
  templateUrl: './scan-rloading.component.html',
  styleUrls: ['./scan-rloading.component.scss']
})
export class ScanRLoadingComponent implements OnInit {

  sub: any;
  docType: any = '';
  websocket: any;
  mainModule = '';
  constructor(private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private apiServices: ApiServices) {
    this.docType = '';
    this._updateKioskSettings();
  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {

    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      if (this.mainModule === 'vcheckin') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.WalkinSettings;
        localStorage.setItem("VISI_SCAN_DOC_DATA", "");
      } else if (this.mainModule === 'vcheckinapproval') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.ReqApptSettings;
        localStorage.setItem("VISI_SCAN_DOC_DATA", "");
      } else if (this.mainModule === 'preAppointment') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.AppointmentSettings.id_verification;
      }
    }
  }
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.docType = params['docType'];
        if (this.docType == undefined || this.docType == '') {
          this.gotoRegistrationScreen();
        } else {
          if (this.docType == 'SING_NRICrDRIV') {
            this.getDeviceConnectionData('getIdScanerData');
          } else if (this.docType == 'PASSPORT') {
            this.getDeviceConnectionData('GetPassportDetail');
          } else if (this.docType == 'MYCARD') {
            this.getMyCardDetails('MYCARD');
          } else if (this.docType == 'BUSINESS') {
            this.getBusinessCardDetails('BUSINESS');
          }
        }
      });
  }
  gotoRegistrationScreen() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
    this.router.navigateByUrl('/landing');
  }
  ngOnDestroy() {
    //this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
    if (this.websocket != null && this.websocket.readyState > 0) {
      this.websocket.close();
    }
  }
  getDeviceConnectionData(action: string) {
    if (this.KIOSK_PROPERTIES.commonsetup.Passport_reader_type == "Sinosecure") {

      let loData = this.SinosecureGetPassportDetail();
    }
    else {

      let req = AppSettings['APP_SERVICES'][action];
      this.apiServices.getApiDeviceConnectionRequest(req).subscribe((data: any) => {
        if ((action == "GetPassportDetail" || action == "getIdScanerData") && data.length > 0) {
          if (data[0].Status) {
            let resData = JSON.parse(data[0]["Data"]) || {};
            if (resData['PassportNo'] != "" && resData['FullNameName'] != "") {
              let userData = {
                "visName": resData['FullNameName'],
                "visDOCID": resData['PassportNo'],
                "visDocImage": (typeof (resData['Image']) != 'undefined' ? "data:image/jpeg;base64," + resData['Image'] : ""),//resData['Image'] || resData['IDImgByte'],
              }
              if (this.mainModule === 'preAppointment') {
                localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
              } else {
                localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
              }

            } else {
              //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
              this.showErrorMsg();
              this.gotoRegistrationScreen();
            }
          } else {
            //this.snackBar.open("Please Try Again !", "", {duration: 3000});
            this.showErrorMsg();
            this.gotoRegistrationScreen();
          }
        } else {
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg();
          this.gotoRegistrationScreen();
        }
      },
        err => {
          console.log("Failed...");
          this.showErrorMsg();
          return false;
        });
    }
    //{"PassportNo":"S8076606H","FullNameName":"ZHANG JINMING","State":"","City":"","Address":"","Country":"CHINESE","DocType":"3362","Gender":"Male","PostCode":"","IDImgByte":"R0
  }
  SinosecureGetPassportDetail() {

    console.log("Sinosecure started..");
    try {
      const _this = this;
      //const readyState = new Array("on connection", "Connection established", "Closing connection", "Close connection");
      var host = AppSettings.APP_DEFAULT_SETTIGS.SinosecureWebsocketUrl;

      _this.websocket = new WebSocket(host);

      _this.websocket.onopen = function () {
        console.log('Open state :' + _this.websocket.readyState);

      }
      _this.websocket.onmessage = function (event: any) {

        var str = event.data;
        var strsub = str;
        if (strsub != "") {
          let strwhite = "";
          let strhead = "";
          let strChipHead = "";
          str = strsub.replace(/\*/g, "\r\n");
          let parseData = JSON.parse(str);
          //console.log("Receive notification 2:"+str);
          if (typeof (parseData.Param["Passport number"]) != "undefined" || typeof (parseData.Param["ID Number"]) != "undefined") {

            let userData = {
              "visName": parseData.Param["National name"] ? parseData.Param["National name"] : parseData.Param["Name"],
              "visDOCID": parseData.Param["Passport number"] ? parseData.Param["Passport number"] : parseData.Param["ID Number"],
              "visDocImage": null,
            }
            _this.websocket.close();
            if (_this.mainModule === 'preAppointment') {
              localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
              _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } });
            } else {
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
              _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } });
            }
          }
          else if (typeof (parseData.Param["White"]) == "undefined") {
            // _this.showErrorMsg();
            // _this.gotoRegistrationScreen();
          }


          /*var seek=str.split("data:image/jpeg;base64,");
          var len = seek.length;
          for(var i = 1; i<len ;i++)
          {
            var strType = seek[i][0] + seek[i][1];
            seek[i] = seek[i].substr(2);
            if(strType == "01")
            strwhite ="data:image/jpeg;base64," + seek[i];
            else if(strType == "08")
            strhead ="data:image/jpeg;base64," + seek[i];
            else if(strType == "16")
            strChipHead ="data:image/jpeg;base64," + seek[i];
          }*/
        }

      }
      _this.websocket.onclose = function () {

        console.log('close state' + _this.websocket.readyState);
        //_this.apiServices.sendLogToServer("Passport", JSON.stringify({ "service": "close state", "router": _this.router.url, "lineNo": 531, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
        // _this.apiServices.sendLogToServer("close state", JSON.stringify({ "router": _this.router.url, "lineNo": 171, "message": "" })).subscribe((data: any) => console.log("AddLogs status="+data));
        if (_this.apiServices.isTest) {

          _this.websocket.close();
          if (_this.mainModule === 'preAppointment') {
            let userData = {
              "visName": "visName",
              "visDOCID": "12345678902",
              "visDocImage": null,
            }
            localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
            _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } });
          } else {
            let userData = {
              "visName": "visName",
              "visDOCID": "vi12",
              "visDocImage": null,
            }
            localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
            _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } });
          }
        }
      }
    }
    catch (exception) {

      console.log("Error");
    }
    //return [];
  }
  getMyCardDetails(action: string) {
    // let req = AppSettings['APP_SERVICES'][action];
    this.apiServices.localGetMethod("GetMyKadDetails", "").subscribe((data: any) => {
      console.log(data);
      if ((action == "MYCARD") && data.length > 0) {
        if (data[0].Status) {
          let resData = JSON.parse(data[0]["Data"]) || [];
          if (resData.length > 0 && resData[0] === "1") {
            let userData = {
              "visName": resData[2],
              "visDOCID": resData[1],
              "visDocImage": (typeof (resData[16]) != 'undefined' ? "data:image/jpeg;base64," + resData[16] : ""),
            }
            if (this.mainModule === 'preAppointment') {
              localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
            } else {
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
            }
          } else {
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg();
            this.gotoRegistrationScreen();
          }
        } else {
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg();
          this.gotoRegistrationScreen();
        }
      } else {
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg();
        this.gotoRegistrationScreen();
      }
    },
      err => {
        console.log("Failed...");
        this.showErrorMsg();
        return false;
      });
  }
  getBusinessCardDetails(action: string) {
    // let req = AppSettings['APP_SERVICES'][action];
    this.apiServices.localGetMethod("getBusinessCardData", "").subscribe((data: any) => {
      console.log(data);
      if ((action == "BUSINESS") && data.length > 0) {
        if (data[0].Status) {
          let resData = JSON.parse(data[0]["Data"]) || {};
          if (resData['ResponseStatus'] == "0") {
            let userData = {
              "FullName": resData["FullName"] || "",
              "CompanyName": resData["CompanyName"] || "",
              "MobileContact": resData["MobileContact"] || "",
              "Email": resData["Email"] || "",
              "Position": resData["Position"] || "",
              "OfficeContact": resData["OfficeContact"] || "",
              "Website": resData["Website"] || "",
              "Address": resData["Address"] || "",
              "CardImagePath": resData["CardImagePath"] || "",
            }
            if (this.mainModule === 'preAppointment') {
              localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
            } else {
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
            }
          } else {
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg();
            this.gotoRegistrationScreen();
          }
        } else {
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg();
          this.gotoRegistrationScreen();
        }
      } else {
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg();
        this.gotoRegistrationScreen();
      }
    },
      err => {
        console.log("Failed...");
        this.showErrorMsg();
        return false;
      });
  }
  takeActFor(action: string) {
    if (action === "home") {
      this.router.navigateByUrl('/landing')
    }
  }
  showErrorMsg() {

    let target_text = "";
    if (this.docType == 'SING_NRICrDRIV') {
      target_text = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRICRLicense_failed_msg;
    } else if (this.docType == 'PASSPORT') {
      target_text = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_failed_msg;
    } else if (this.docType == 'MYCARD') {
      target_text = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRIC_failed_msg;
    } else if (this.docType == 'BUSINESS') {
      target_text = this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.BusinessCard_failed_msg;
    }
    let documentTypes = {
      "MYCARD": this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRIC_caption,
      "SING_NRICrDRIV": this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.NRICRLicense_caption,
      "PASSPORT": this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_caption,
      "BUSINESS": this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.BusinessCard_caption,
      //"PREAPPOINTMT": this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.in_prereg_option.in_prereg_label
    }

    target_text = target_text.replace(new RegExp("{{document}}", 'g'), documentTypes[this.docType]);
    let dialogRef = this.dialog.open(appConfirmDialog, {
      width: '250px',
      data: { title: target_text, btn_ok: "Ok", document: documentTypes[this.docType] }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.gotoRegistrationScreen();
    });
  }
}
