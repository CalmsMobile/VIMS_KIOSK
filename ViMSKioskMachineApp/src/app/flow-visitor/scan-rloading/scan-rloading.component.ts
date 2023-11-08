import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/services/app.settings';
import { ApiServices } from 'src/services/apiService';
import { MatSnackBar, MatDialog } from '@angular/material';
import { appConfirmDialog } from '../flow-visitor.component';
import { DialogAppSessionTimeOutDialog } from 'src/app/app.component';
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
        this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle = this.KIOSK_PROPERTIES.AppointmentSettings.AdditionalTitle;
        console.log(this.KIOSK_PROPERTIES.COMMON_CONFIG);
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
                this.getAppointmentDetails(resData['PassportNo'])
                /* localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } }); */
              } else {
                localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
              }

            } else {
              //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
              this.showErrorMsg(action);
              //this.gotoRegistrationScreen();
            }
          } else {
            //this.snackBar.open("Please Try Again !", "", {duration: 3000});
            this.showErrorMsg(action);
            //this.gotoRegistrationScreen();
          }
        } else {
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg(action);
          //this.gotoRegistrationScreen();
        }
      },
        err => {
          console.log("Failed...");
          this.showErrorMsg(action);
          return false;
        });
    }
    //{"PassportNo":"S8076606H","FullNameName":"ZHANG JINMING","State":"","City":"","Address":"","Country":"CHINESE","DocType":"3362","Gender":"Male","PostCode":"","IDImgByte":"R0
  }
  SinosecureGetPassportDetail() {

    console.log("Sinosecure started..");
    try {
      const _this = this;
      let isRead = false;
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
            isRead = true;
            _this.websocket.close();
            if (_this.mainModule === 'preAppointment') {
              _this.getAppointmentDetails(parseData.Param["Passport number"] ? parseData.Param["Passport number"] : parseData.Param["ID Number"]);
              /* localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
              _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } }); */
            } else {
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
              _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } });
            }
          }
          else if (typeof (parseData.Param["White"]) == "undefined") {
            // _this.showErrorMsg(action);
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

        if (_this.apiServices.isTest) {

          _this.websocket.close();
          if (_this.mainModule === 'preAppointment') {
            let userData = {
              "visName": "visName",
              "visDOCID": "12345678902",
              "visDocImage": null,
            }
            _this.getAppointmentDetails("123456789012");
            /* localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
            _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } }); */
          } else {
            let userData = {
              "visName": "visName",
              "visDOCID": "vi12",
              "visDocImage": null,
            }
            localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
            _this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: _this.docType } });
          }
        } else {
          if (!isRead) {
            let target_text = "";
            target_text = _this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_failed_msg;

            let documentTypes = {
              "PASSPORT": _this.KIOSK_PROPERTIES.COMMON_CONFIG.checkin.Passport_caption
            }
            target_text = target_text.replace(new RegExp("{{document}}", 'g'), documentTypes[this.docType]);
            const dialogRef = _this.dialog.open(DialogAppSessionTimeOutDialog, {
              //width: '250px',
              data: {
                "title": '',
                "subTile": target_text,
                "enbCancel": true,
                "oktext": 'Retry',
                "canceltext": 'Go Home'
              },
              disableClose: false
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                _this.SinosecureGetPassportDetail();
              } else {
                _this.gotoRegistrationScreen();
              }
            });
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
              this.getAppointmentDetails(resData[1])
              /* localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } }); */
            } else {
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });
            }
          } else {
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg(action);
            //this.gotoRegistrationScreen();
          }
        } else {
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg(action);
          //this.gotoRegistrationScreen();
        }
      } else {
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg(action);
        //this.gotoRegistrationScreen();
      }
    },
      err => {
        console.log("Failed...");
        this.showErrorMsg(action);
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

              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: this.docType } });

          } else {
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg(action);
            //this.gotoRegistrationScreen();
          }
        } else {
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg(action);
          //this.gotoRegistrationScreen();
        }
      } else {
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg(action);
        //this.gotoRegistrationScreen();
      }
    },
      err => {
        console.log("Failed...");
        this.showErrorMsg(action);
        return false;
      });
  }
  takeActFor(action: string) {
    if (action === "home") {
      this.router.navigateByUrl('/landing')
    }
  }
  showErrorMsg(action) {

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
    /* let dialogRef = this.dialog.open(appConfirmDialog, {
      width: '250px',
      data: { title: target_text, btn_ok: "Ok", document: documentTypes[this.docType] }
    }); */
    const dialogRef = this.dialog.open(DialogAppSessionTimeOutDialog, {
      //width: '250px',
      data: {
        "title": '',
        "subTile": target_text,
        "enbCancel": true,
        "oktext": 'Retry',
        "canceltext": 'Go Home'
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action == 'getIdScanerData') {
          this.getDeviceConnectionData('getIdScanerData');
        } else if (action == 'GetPassportDetail') {
          this.getDeviceConnectionData('GetPassportDetail');
        } else if (action == 'MYCARD') {
          this.getMyCardDetails('MYCARD');
        } else if (action == 'BUSINESS') {
          this.getBusinessCardDetails('BUSINESS');
        }
      }
      else
        this.gotoRegistrationScreen();
    });
  }
  purposes = [];
  _getAllPurposeOfVisit() {
    this.apiServices.localPostMethod('getPurpose', {}).subscribe((data: any) => {
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        this.purposes = JSON.parse(data[0]["Data"]);
        localStorage.setItem('_PURPOSE_OF_VISIT', data[0]["Data"]);
        console.log("--- Purpose of Visit Updated");
      }
    },
      err => {
        console.log("Failed...");
        return false;
      });
  }

  getPurposeName(purposeId, isID) {
    let purposeTitle = purposeId;
    console.log(this.purposes);
    this.purposes.forEach(element => {
      if (element.visitpurpose_desc == purposeId || element.visitpurpose_id == purposeId) {
        if (isID) {
          purposeTitle = element.visitpurpose_id;
        } else {
          purposeTitle = element.visitpurpose_desc;
        }

        return purposeTitle;
      }
    });
    return purposeTitle
  }
  getAppointmentDetails(APONTMNT_NRIC) {
    document.getElementById("bodyloader").style.display = "block";
    let prepareData: any = "";
    APONTMNT_NRIC = APONTMNT_NRIC.replace(/\s|-/g, '');

    prepareData = { "nric": APONTMNT_NRIC, "att_appointment_id": "", "ContactNo": "", "Email": "" };

    console.log(JSON.stringify(prepareData));
    this.apiServices.localPostMethod("getAptmentInformation", prepareData).subscribe((data: any) => {
      console.log("getAppointmentDetails " + JSON.stringify(data));
      document.getElementById("bodyloader").style.display = "none";
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let Data = data[0]["Data"];
        if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {
          if (Data["Table1"] != undefined && Data["Table1"].length > 0) {
            if (Data["Table1"].length == 1) {
              let _app_details = Data["Table1"][0];
              /* _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
              _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
              _app_details['aptid'] = _app_details.ApptmentId.toString();
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } }); */
              if (_app_details['AllowedVisits'] > 0) {
                if (_app_details['UsedCount'] > 0 && _app_details['AllowedVisits'] <= _app_details['UsedCount']) {
                  //<Message> = "The maximum number of check-ins for this appointment has been reached, so you won't be able to check-in using this appointment. Please contact host or reception desk for further assistance.";
                  this.router.navigateByUrl('/visitorRegisType');
                  this.dialog.open(appConfirmDialog, {
                    width: '250px',
                    data: { title: "The maximum number of check-ins for this appointment has been reached, so you won't be able to check-in using this appointment. Please contact host or reception desk for further assistance.", btn_ok: "Ok" }
                  });
                } else {
                  _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
                  _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
                  _app_details['aptid'] = _app_details.ApptmentId.toString();
                  localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));

                  this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });

                }
              } else {
                _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
                _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
                _app_details['aptid'] = _app_details.ApptmentId.toString();
                localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));

                this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });

              }
            } else {
              this.router.navigate(['/appointmentList'], { queryParams: { data: JSON.stringify(Data["Table1"]) } });
            }

          } else {
            this.router.navigateByUrl('/visitorRegisType');
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: { title: this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle.appt_not_found_desc, btn_ok: "Ok" }
            });
          }
        } else {
          this.router.navigateByUrl('/visitorRegisType');
          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: { title: Data["Table"][0]['description'], btn_ok: "Ok" }
          });
        }
      } else {
        this.router.navigateByUrl('/visitorRegisType');
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle.appt_not_found_desc, btn_ok: "Ok" }
        });
      }
    },
      err => {
        this.router.navigateByUrl('/visitorRegisType');
        document.getElementById("bodyloader").style.display = "none";
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle.appt_not_found_desc, btn_ok: "Ok" }
        });
        return false;
      });
  }

}
