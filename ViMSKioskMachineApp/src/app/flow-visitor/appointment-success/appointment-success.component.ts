import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { SettingsService } from 'src/services/settings.service';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppSettings } from 'src/services/app.settings';

@Component({
  selector: 'app-appointment-success',
  templateUrl: './appointment-success.component.html',
  styleUrls: ['./appointment-success.component.scss']
})
export class AppointmentSuccessComponent implements OnInit {
  sub: any;
  action: any = '';
  isLoading: boolean = true;
  LOGO_IMG = "assets/images/cus_icons/icon_rightyes.png";
  TEST_PIN: any = "";
  RESULT_MSG = "";
  RESULT_MSG2 = "";
  RESULT_MSG3 = "";
  AVAL_VISITORS: any = [];
  mainModule = '';
  CURRENT_VISTOR_CHCKIN_DATA_FOR_PRINT: any;
  EnableAcsQrCode: any = false;
  CheckInVisitorData: any = [];
  DisplayImageHandlerURL: SafeResourceUrl;
  DisplaySuccessImageHandlerURL: SafeResourceUrl;
  qrcodeProcessed = false;
  base64Image = '';
  GScopeValue: any = ""; GVisitorPass: any = ""; GPermittedTime: any = "";
  LabelPrintEnable: any = false;
  ReceiptPrintEnable: any = false;
  LabelPrintManualOrAuto: any = 10;
  @ViewChild('cardSerInput') cardSerInput: ElementRef;

  constructor(private route: ActivatedRoute,
    private settingsService: SettingsService,
    public datePipe: DatePipe,
    private _location: Location,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router, private apiServices: ApiServices) {
    this.isLoading = true;
    this.TEST_PIN = "";
    this.DisplayImageHandlerURL;
    this._initPrintAndCardDispenserValues();
  }
  _initPrintAndCardDispenserValues() {
    this.AVAL_VISITORS = [];
    var infoData = {
      IsIndividual: false,
      VisitorGender: "",
      VisitorCompany: "",
      VisitorRace: "",
      VisitorState: "",
      VisitorCountry: "",
      VisitorCategory: "",
      VisitorCategoryText: "",
      Email: "",
      Contact: "",
      HostName: "",
      HostNameText: "",
      HostPurpose: "",
      HostPurposeText: "",
      NoOfPerson: "1",
      VehicleNo: "",
      ExpiryTime: "",
      smardno: "",
      HostCompany: "",
      HostDepartment: "",
      HostFloor: "",
      CheckInLocation: "",
      otherInfo: {
        isView: false,
        departname: "",
        floorname: "",
      },
      Hexnumber: 0
    }
    var visitorInfo = {
      Nric: "",
      Name: "",
      ImgSrc: "",
      DocSrc: "",
      Hexnumber: ""
    }
    this.GScopeValue = { infoData: infoData, visitorInfo: visitorInfo };
    this.GScopeValue.getDayweek = function () {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(new Date()).getDay()];
    }
    let getDateTime = () => {
      return this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
    }
    this.GScopeValue.getDate = function () {
      return getDateTime();
    }
    // setInterval(()=>{
    // if(this.cardSerInput != undefined)
    //   this.cardSerInput.nativeElement.focus();
    // },100);
  }
  ngOnInit() {
    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
    this._updateKioskSettings();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.action = params['action'] || "";
        if (this.action == 'register') {
          this._registerVisitors();
        }
      });
  }
  takeActFor(action: string) {
    if (action === "home") {
      this.router.navigateByUrl('/landing');
    }
  }
  getImageHandlerURL() {

    let poReturnVal = "";
    if (this.CheckInVisitorData != undefined) {
      if (this.CheckInVisitorData.length > 0) {
        if (this.CheckInVisitorData[0].IsDynamicQR) {

          poReturnVal = this.CheckInVisitorData[0].EncryptDynQRVal;
        } else if (this.KIOSK_PROPERTIES['modules']['printer']['qrRbar_print_field'] != '') {

          switch (this.KIOSK_PROPERTIES['modules']['printer']['qrRbar_print_field']) {
            case "NRIC":
              poReturnVal = this.getFieldValue("VisitorNRIC", 30, "L") || "";
              break;
            case "VEHICLE_NO":
              poReturnVal = this.CheckInVisitorData[0].VisitorVehicle;
              break;
            case "PASS_NO":
              poReturnVal = this.CheckInVisitorData[0].VisitorPass;
              break;
            case "SMART_NO":
              poReturnVal = this.CheckInVisitorData[0].Smartcard;
              break;
            case "DYNAMIC_HEX":
              poReturnVal = this.CheckInVisitorData[0].DynamicHex;
              break;
            case "DYNAMIC_DEC":
              poReturnVal = parseInt(this.CheckInVisitorData[0].DynamicHex, 16).toString();
              break;
          }
        }
      }
    }
    const image = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_image'];
    if (image) {
      this.DisplaySuccessImageHandlerURL = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + image.split('base64,')[1]);
    }

    if (poReturnVal) {
      return JSON.parse(localStorage.getItem('APP_KIOSK_CODE_DECRIPTED')).ApiUrl + 'Handler/QRImageHandler.ashx?Code=' + poReturnVal;
    }
  }
  processNexttoSuccess() {
    this.qrcodeProcessed = true;
    let _timeout = this.KIOSK_PROPERTIES['commonsetup']['timer']['tq_scr_timeout_msg'] || 5;
    _timeout = parseInt(_timeout) * 1000;
    setTimeout(() => {
      this.router.navigateByUrl('/landing');
    }, _timeout);
  }
  triggerLabelPrint() {

    if (this.LabelPrintEnable) {

      this.loadlblprint(this.CheckInVisitorData, (pri_status: boolean) => { });
    }
    if (this.ReceiptPrintEnable) {

      this.loadreceiptprint(this.CheckInVisitorData);
    }
  }
  _registerVisitors(isRetry?: boolean) {
    let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    if (isRetry) {
      if (uploadArray['visitorDetails'] != undefined && uploadArray['visitorDetails'].length > 0) {
        for (let m = 0; m < uploadArray['visitorDetails'].length; m++) {
          uploadArray['visitorDetails'][m]['SkipFR'] = true;
        }
      }
    }
    var _callErrorMsg = () => {
      this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg2'];
      const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
        data: { "title": this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg2'], "subTile": "Please try again or Contact Reception" }
      });
      dialogRef.afterClosed().subscribe((data) => {
        this.router.navigateByUrl('/landing');
      });
    }
    if (uploadArray['visitorDetails'] != undefined && uploadArray['visitorDetails'].length > 0) {
      uploadArray['visitorDetails'][0]['temperature'] = localStorage.getItem("Temperature");
      uploadArray['visitorDetails'][0].category = uploadArray['visitorDetails'][0].categoryId;
    }
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    let CheckINLocation = "";
    if (setngs != undefined && setngs != "") {
      CheckINLocation = JSON.parse(setngs)['kioskName'] || "";
    }
    uploadArray.Location = CheckINLocation;
    uploadArray.CheckinBy = 'SSK';
    if (this.mainModule === 'vcheckinapproval') {
      this.callApitoSaveAppointment(uploadArray['visitorDetails'][0]);
      return;
    }

    this.apiServices.localPostMethod("AddAttendanceForVisitor", uploadArray).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let _RETdata = data[0]["Data"];
        if (_RETdata != "") {
          let Data = JSON.parse(_RETdata) || [];
          console.log(Data);
          if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {
            if (Data["Table1"] != undefined && Data["Table1"].length > 0) {
              let _RESDATA = Data["Table1"];
              if (_RESDATA.length > 0) {
                this.proceedThisAttIDsForCheckin(_RESDATA);
              }
            }
          } else if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 70) {
            const dialogRef = this.dialog.open(DialogAppCommonDialog, {
              disableClose: true,
              data: {
                "title": "Profile image  ?", "subTile": Data["Table"][0]['Description'],
                "enbCancel": true, "oktext": "Continue without image", "canceltext": "Retry"
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this._registerVisitors(true);
              } else {
                //this.router.navigateByUrl('/landing');
                localStorage.setItem("VISI_LIST_ARRAY", '{"appSettings":{}, "visitorDetails" :[]}');
                localStorage.setItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE, '');
                this._location.back();
              }
            });
          } else {
            _callErrorMsg();
            return false;
          }
        }
      } else {
        _callErrorMsg();
        return false;
      }
    },
      err => {
        _callErrorMsg();
        return false;
      });
  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }

  callApitoSaveAppointment(appointment1) {
    const cDate = new Date();
    const startTime = this.datePipe.transform(cDate + "", "MM-dd-yyyy HH:mm:ss");
    const endDate = new Date().setTime(new Date().getTime() + (appointment1.meetingHoursValue ? appointment1.meetingHoursValue : 1) * 60 * 60 * 1000);
    const endTime = this.datePipe.transform(endDate + "", "MM-dd-yyyy HH:mm:ss");
    const appointment: any = {};
    appointment.SEQ_ID = '';
    appointment.Address = '';
    appointment.CategoryId = appointment1.categoryId ? appointment1.categoryId : '';
    appointment.CompanyId = appointment1.company ? appointment1.company : '';
    appointment.Contact = appointment1.contact ? appointment1.contact : '';
    appointment.CountryId = appointment1.countryId ? appointment1.countryId : '';
    appointment.Email = appointment1.email ? appointment1.email : '';
    appointment.EndDateTime = endTime;
    appointment.FloorId = '';
    appointment.FullName = appointment1.name ? appointment1.name : '';
    appointment.GenderId = appointment1.genderId ? appointment1.genderId : '';

    appointment.HostDeptId = appointment1.hostDetails.HostDeptId ? appointment1.hostDetails.HostDeptId : '';
    appointment.HostId = appointment1.hostDetails.id ? appointment1.hostDetails.id : '';
    appointment.IdentityNo = appointment1.id ? appointment1.id : '';
    appointment.Photo = appointment1.visitorB64Image ? appointment1.visitorB64Image : '';
    appointment.PurposeId = appointment1.purposeId ? appointment1.purposeId : (appointment1.purpose ? appointment1.purpose : '');
    appointment.Remarks = '';
    appointment.RoomId = '';

    appointment.StartDateTime = startTime;
    appointment.VehicleNo = appointment1.vehicle;
    appointment.AnswerList = appointment1.VisitorAnswers;
    appointment.AttachmentList = '';
    appointment.CheckList = '';
    appointment.VehicleBrand = '';
    appointment.VehicleModel = '';
    appointment.VehicleColor = '';

    var _callErrorMsg = () => {
      this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg2'];
      const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
        data: { "title": this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg2'], "subTile": "Please try again or Contact Reception" }
      });
      dialogRef.afterClosed().subscribe((data) => {
        this.router.navigateByUrl('/landing');
      });
    }

    if (appointment) {
      console.log("VisitorAckSave : " + JSON.stringify(appointment));
    }
    this.apiServices.localPostMethod("VisitorAckSave", appointment).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let _RETdata = data[0]["Data"];
        if (_RETdata != "") {
          let Data = JSON.parse(_RETdata) || [];
          console.log(Data);
          if (Data["Table"] != undefined && Data["Table"].length > 0 && (Data["Table"][0]['code'] == 'S' || Data["Table"][0]['Code'] == 10)) {
            this.isLoading = false;

            let _timeout = this.KIOSK_PROPERTIES['commonsetup']['timer']['tq_scr_timeout_msg'] || 5;
            // this.RESULT_MSG = Data["Table"][0].description;
            this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['apptreg_success_message_first'];
            this.RESULT_MSG2 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['apptreg_success_message_mid'];
            this.RESULT_MSG3 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['apptreg_success_message_last'];
            this.DisplayImageHandlerURL = this.getImageHandlerURL();
            this.qrcodeProcessed = true;
            _timeout = parseInt(_timeout) * 1000;
            setTimeout(() => {
              this.router.navigateByUrl('/landing');
            }, _timeout);
          } else if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['code'] == 'S') {
            const dialogRef = this.dialog.open(DialogAppCommonDialog, {
              disableClose: true,
              data: {
                "title": "Notification", "subTile": Data["Table"][0]['description'],
                "enbCancel": true, "oktext": "Retry", "canceltext": "Cancel"
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this._registerVisitors(true);
              } else {
                //this.router.navigateByUrl('/landing');
                localStorage.setItem("VISI_LIST_ARRAY", '{"appSettings":{}, "visitorDetails" :[]}');
                localStorage.setItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE, '');
                this._location.back();
              }
            });
          } else {
            _callErrorMsg();
            return false;
          }
        }
      } else {
        _callErrorMsg();
        return false;
      }
    },
      err => {
        _callErrorMsg();
        return false;
      });
  }

  private visitorIndividualCheckIn(att_id: string, att_card_serialno: string, _callback: any) {
    let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    let aptid = '';
    if (uploadArray['visitorDetails'] != undefined && uploadArray['visitorDetails'].length > 0) {
      aptid = uploadArray['visitorDetails'][0]['aptid'];
    }
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    let CheckINLocation = "";
    if (setngs != undefined && setngs != "") {
      CheckINLocation = JSON.parse(setngs)['kioskName'] || "";
    }
    let prepareData = {
      "att_id": att_id, "att_card_serialno": att_card_serialno,
      "aptid": aptid,
      "vbookingseqid": aptid,
      "QRCodeField": this.KIOSK_PROPERTIES['modules']['printer']['qrRbar_print_field'],
      "CurrentDate": this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      "Location": CheckINLocation,
      "CheckinBy": 'SSK'
    }
    this.EnableAcsQrCode = (typeof (this.KIOSK_PROPERTIES['modules']['ACS']) == 'undefined' ? false : this.KIOSK_PROPERTIES['modules']['ACS']['EnableAcsQrCode']);
    this.LabelPrintEnable = this.KIOSK_PROPERTIES['modules']['printer']['enable'];
    this.ReceiptPrintEnable = this.KIOSK_PROPERTIES['modules']['printer']['recipt_enable'];
    this.LabelPrintManualOrAuto = typeof (this.KIOSK_PROPERTIES['modules']['printer']['print_option']) == 'undefined' ? 20 : this.KIOSK_PROPERTIES['modules']['printer']['print_option'];
    console.log("LabelPrintManualOrAuto " + this.LabelPrintManualOrAuto + this.LabelPrintEnable);
    console.log("ReceiptPrintEnable " + this.ReceiptPrintEnable);
    this.apiServices.localPostMethod("visitorIndividualCheckIn", prepareData).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let Data = JSON.parse(data[0]["Data"]);
        if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {
          if (Data["Table1"] != undefined && Data["Table1"].length > 0) {
            this.CheckInVisitorData = Data["Table1"];
            this.DisplayImageHandlerURL = this.getImageHandlerURL();
            if (!this.EnableAcsQrCode || !this.DisplayImageHandlerURL) {
              this.qrcodeProcessed = true;
            }
            _callback({ "s": true, "m": "" }, Data["Table1"]);
            //[{"VisitorNRIC":"gg","VisitorVehicle":"","VisitorPass":null,"Smartcard":"","DynamicHex":null,"PrinterEnable":"1","ReceiptPrinterEnable":"0","PermittedTime":"2019-02-13T18:31:00","CompanyName":"","Address1":"","Address2":"","Address3":"","CompanyMobile":"","CompanyFax":"","Terms1":null,"Terms2":null,"Terms3":null,"Terms4":null,"Terms5":null,"Message1":null,"Message2":null,"EnablePrint":"0","PrintType":null,"PrintField":null,"SlipTitle":"VISITOR ENTRY SLIP"}]
            return;
          } else {
            _callback({ "s": false, "m": "Visitor Information Empty" });
            return;
          }
        } else {
          _callback({ "s": false, "m": "Visitor Checkin Return Code != 10" });
          return;
        }
      } else {
        _callback({ "s": false, "m": "Visitor Checkin API return Empty" });
        return;
      }
    },
      err => {
        _callback({ "s": false, "m": "Visitor Checkin API Error" });
        return false;
      });
  }
  //-------------------- Hardware Services --------------------
  private chk_hardwares_to_finish(att_id: string, _visitorData: any, _nextElemcallBack: any) {

    let _Modules = this.KIOSK_PROPERTIES['modules'];
    let _get_cardSerial_number = (_callback: any) => {
      this.apiServices.localGetMethod("SD_GetCardStatus", "").subscribe((data: any) => {
        if (data.length > 0 && data[0]['Data'] != "") {
          let cardStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
          if (cardStatus['ResponseStatus'] == "0") {
            // Card in Starting Position
            if (cardStatus["CardStatusCode"] == "020" || cardStatus["CardStatusCode"] == "010") {
              this.apiServices.localGetMethod("SD_MoveCardToReaderPosition", "").subscribe((data: any) => {
                if (data.length > 0 && data[0]['Data'] != "") {
                  let cardMoveStatus = JSON.parse(data[0]['Data']);
                  if (cardMoveStatus['ResponseStatus'] == "0") {
                    _get_cardSerial_number(_callback);
                  } else {
                    _callback(false, "0");
                    return;
                  }
                } else {
                  _callback(false, "0");
                  return;
                }
              },
                err => {
                  _callback(false, "0");
                  return false;
                });
            }
            // Card in Reading Position
            else if (cardStatus["CardStatusCode"] == "220" || cardStatus["CardStatusCode"] == "210") {
              this.apiServices.localGetMethod("SD_GetCardSN", "").subscribe((data: any) => {
                if (data.length > 0 && data[0]['Data'] != "") {
                  let cardSerialData = JSON.parse(data[0]['Data']);
                  if (cardSerialData['ResponseStatus'] == "0") {
                    _callback(true, cardSerialData['CardSN']);
                    return;
                  } else {
                    _callback(false, "0");
                    return;
                  }
                } else {
                  _callback(false, "0");
                  return;
                }
              },
                err => {
                  _callback(false, "0");
                  return false;
                });
            }
            // Card in Eject Position
            else if (cardStatus["CardStatusCode"] == "120" || cardStatus["CardStatusCode"] == "110" || cardStatus["CardStatusCode"] == "100") {
              const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
                data: { "title": _Modules['card_dispenser']['take_card_msg'] || "Before proceed, Please take your card first !", "subTile": "", "ok": "Retry" },
                disableClose: true
              });
              dialogRef.afterClosed().subscribe((data) => {
                if (data) {
                  _get_cardSerial_number(_callback);
                }
              });
            }
            else {
              _callback(false, "0");
              return;
            }
          } else {
            _callback(false, "0");
            return;
          }
        } else {
          _callback(false, "0");
          return;
        }
      },
        err => {
          _callback(false, "0");
          return false;
        });

    }
    if (_Modules['card_dispenser']['enable'] && (_Modules['printer']['enable'] || _Modules['printer']['recipt_enable'])) {
      _get_cardSerial_number((status: boolean, serial: string) => {
        if (status) {
          //Update Visitor Card Serial Number
          this.visitorIndividualCheckIn(att_id, serial, (status: any, visitorData: any) => {
            let _preparePrintLabel = (cardDProcessStatus: boolean) => {
              this.settingsService._kiosk_Minus1AvailCard((_minStatus: boolean) => { })
              this.GScopeValue.visitorInfo.Nric = _visitorData.vis_id || "";
              this.GScopeValue.visitorInfo.Name = _visitorData.vis_name || "";
              this.GScopeValue.infoData.VisitorCompany = _visitorData.vis_company || "";
              this.GScopeValue.infoData.VisitorCategoryText = _visitorData.Category || "";
              this.GScopeValue.infoData.Contact = _visitorData.vis_contact || "";
              this.GScopeValue.infoData.Email = _visitorData.vis_email || "";
              this.GScopeValue.infoData.HostNameText = _visitorData.host_name || "";
              this.GScopeValue.infoData.HostCompany = _visitorData.host_company_name || "";
              this.GScopeValue.infoData.HostDepartment = _visitorData.host_department_name || "";
              this.GScopeValue.infoData.HostFloor = _visitorData.host_floor_name || "";
              this.GScopeValue.infoData.VehicleNo = _visitorData.vis_vehicle || "";
              this.GScopeValue.infoData.HostPurposeText = _visitorData.vis_reason || "";
              this.GScopeValue.visitorInfo.ImgSrc = _visitorData.vis_avatar_image || "";
              if (visitorData.length > 0) {
                if (_Modules['printer']['enable'] && this.LabelPrintManualOrAuto == 10) {
                  this.loadlblprint(visitorData, (pri_status: boolean) => { });
                }
                if (_Modules['printer']['recipt_enable'] && this.LabelPrintManualOrAuto == 10) {
                  this.loadreceiptprint(visitorData);
                }
                _nextElemcallBack(true);
                return;
              } else {
                _nextElemcallBack(false);
                return;
              }
            }
            // If Success Eject Visitor Card
            if (status['s'] === true) {
              this.apiServices.localGetMethod("SD_EjectCard", "").subscribe((data: any) => {
                if (data.length > 0 && data[0]['Data'] != "") {
                  let cardEjectStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
                  if (cardEjectStatus['ResponseStatus'] == "0") {
                    // If Eject Success Proceed Next Visitor attendance ID
                    _preparePrintLabel(true);
                  } else {
                    _preparePrintLabel(false);
                  }
                } else {
                  _preparePrintLabel(false);
                }
              },
                err => {
                  _preparePrintLabel(false);
                });
            }
          });

        } else {
          const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
            data: { "title": "Please Contact reception !", "subTile": "Visitor checkin : Problem in card dispenser !", "ok": "Ok" },
            disableClose: true
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.router.navigate(['/landing']);
          });
        }
      });
    } else if (_Modules['card_dispenser']['enable'] && !_Modules['printer']['enable'] && !_Modules['printer']['recipt_enable']) {
      _get_cardSerial_number((status: boolean, serial: string) => {
        if (status) {
          //Update Visitor Card Serial Number
          this.visitorIndividualCheckIn(att_id, serial, (status: any, visitorData: any) => {
            // If Success Eject Visitor Card
            if (status['s'] === true) {
              this.apiServices.localGetMethod("SD_EjectCard", "").subscribe((data: any) => {
                if (data.length > 0 && data[0]['Data'] != "") {
                  let cardEjectStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
                  if (cardEjectStatus['ResponseStatus'] == "0") {
                    // If Eject Success Proceed Next Visitor attendance ID
                    this.settingsService._kiosk_Minus1AvailCard((status: boolean) => { })
                    _nextElemcallBack(true);
                    return;
                  } else {
                    _nextElemcallBack(false);
                    return;
                  }
                } else {
                  _nextElemcallBack(false);
                  return;
                }
              },
                err => {
                  _nextElemcallBack(false);
                  return false;
                });
            }
          });
        } else {
          const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
            data: { "title": "Please Contact reception !", "subTile": "Visitor checkin : Problem in card dispenser !", "ok": "Ok" },
            disableClose: true
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.router.navigate(['/landing']);
          });
        }
      });
    } else if ((_Modules['printer']['enable'] || _Modules['printer']['recipt_enable']) && !_Modules['card_dispenser']['enable']) {

      this.visitorIndividualCheckIn(att_id, "", (status: any, visitorData: any) => {
        // If Success Eject Visitor Card
        this.GScopeValue.visitorInfo.Nric = _visitorData.vis_id || "";
        this.GScopeValue.visitorInfo.Name = _visitorData.vis_name || "";
        this.GScopeValue.infoData.VisitorCompany = _visitorData.vis_company || "";
        this.GScopeValue.infoData.VisitorCategoryText = _visitorData.Category || "";
        this.GScopeValue.infoData.Contact = _visitorData.vis_contact || "";
        this.GScopeValue.infoData.Email = _visitorData.vis_email || "";
        this.GScopeValue.infoData.HostNameText = _visitorData.host_name || "";
        this.GScopeValue.infoData.HostCompany = _visitorData.host_company_name || "";
        this.GScopeValue.infoData.HostDepartment = _visitorData.host_department_name || "";
        this.GScopeValue.infoData.HostFloor = _visitorData.host_floor_name || "";
        this.GScopeValue.infoData.VehicleNo = _visitorData.vis_vehicle || "";
        this.GScopeValue.infoData.HostPurposeText = _visitorData.vis_reason || "";
        this.GScopeValue.visitorInfo.ImgSrc = _visitorData.vis_avatar_image || "";

        if (status['s'] === true) {
          if (visitorData.length > 0) {
            if (_Modules['printer']['enable'] && this.LabelPrintManualOrAuto == 10) {

              this.loadlblprint(visitorData, (pri_status: boolean) => { });
            }
            if (_Modules['printer']['recipt_enable'] && this.LabelPrintManualOrAuto == 10) {

              this.loadreceiptprint(visitorData);
            }
            _nextElemcallBack(true);
            return;
          } else {
            _nextElemcallBack(false);
          }
        } else {
          _nextElemcallBack(false);
        }
      });
    } else if (!_Modules['printer']['enable'] && !_Modules['printer']['recipt_enable'] && !_Modules['card_dispenser']['enable']) {
      this.visitorIndividualCheckIn(att_id, "", (status: any, visitorData: any) => {
        if (status['s'] === true) {
          _nextElemcallBack(true);
        } else {
          _nextElemcallBack(false);
        }
      });
    }
  }
  private proceedThisAttIDsForCheckin(att_IDs: any) {
    let i = 0, suc_flag = 0;
    let _callNext = () => {
      if (i < att_IDs.length) {
        this.chk_hardwares_to_finish(att_IDs[i]['att_id'], att_IDs[i], (status: boolean) => {
          if (status) {
            suc_flag++;
          }
          i++;
          _callNext();
          return;
        });
      } else {
        this._finish_with_success_msg();
      }
    }
    _callNext();
  }
  private _finish_with_success_msg() {
    this.isLoading = false;
    this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg1'];
    this.RESULT_MSG2 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_message_mid'];
    this.RESULT_MSG3 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_message_last'];
    const image = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_image'];
    if (image && !this.DisplayImageHandlerURL) {
      this.DisplaySuccessImageHandlerURL = image;
    }
    if (this.qrcodeProcessed) {
      let _timeout = this.KIOSK_PROPERTIES['commonsetup']['timer']['tq_scr_timeout_msg'] || 5;
      _timeout = parseInt(_timeout) * 1000;
      setTimeout(() => {
        this.router.navigateByUrl('/landing');
      }, _timeout);
    }

  }

  // --------------- Print Label -------------------
  /*Load Dynamic Template Start*/
  loadlblprint(poReturnData, _callback: any) {
    var postData = {}, poReturnVal = "";
    this.apiServices.getPrintTemplateData(postData).subscribe((data: any) => {
      //console.log(data);
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let Data = JSON.parse(data[0]["Data"]);
        if (Data["Table"] != undefined && Data["Table"].length > 0) {
          Data["Table"][0].ReturnValue = "";
          //GScopeValue = angular.element(document.getElementsByClassName('ui-view')).scope();
          //GPANEL_BG_IMAGE_NEW = "data:image/png;base64," + Data["Table1"][0].PANEL_BG_IMAGE;
          //var templateContent = $("#myLabelTemplate").html();
          if (poReturnData != undefined) {
            if (poReturnData.length > 0) {
              this.GVisitorPass = poReturnData[0].VisitorPass || "";
              poReturnData[0].PermittedTime = "";//new Date(poReturnData[0].PermittedTime);
              this.GPermittedTime = poReturnData[0].PermittedTime;
              if (this.CheckInVisitorData != undefined) {
                if (this.CheckInVisitorData.length > 0) {
                  if (this.CheckInVisitorData[0].IsDynamicQR) {
                    debugger
                    poReturnVal = this.CheckInVisitorData[0].EncryptDynQRVal;
                  } else if ((Data["Table"][0].PIC_BARCODE_ASSIGNTO).trim() != "") {
                    debugger
                    switch (Data["Table"][0].PIC_BARCODE_ASSIGNTO) {
                      case "Visitor NRIC":
                        poReturnVal = poReturnData[0].VisitorNRIC;
                        break;
                      case "Visitor Vehicle #":
                        poReturnVal = poReturnData[0].VisitorVehicle;
                        break;
                      case "Visitor Pass #":
                        poReturnVal = poReturnData[0].VisitorPass;
                        break;
                      case "Smartcard #":
                        poReturnVal = poReturnData[0].Smartcard;
                        break;
                      case "Dynamic Hex #":
                        poReturnVal = poReturnData[0].DynamicHex;
                        break;
                      case "Random Dec #":
                        poReturnVal = poReturnData[0].DynamicHex;
                        break;
                    }
                  }
                  Data["Table"][0].ReturnValue = poReturnVal;
                }
              }
            }
          }
          /*Form Value*/
          Data["Table"][0].bgImage = Data["Table1"][0].PANEL_BG_IMAGE;
          Data["Table"][0].DAY_STATUS_VAL = this.getFieldValue('Day', Data["Table"][0].DAY_STATUS_LABLE_TEXT_MAX, '');
          Data["Table"][0].VImage = this.getFieldValue('VImage', 0, '');
          Data["Table"][0].LABLE1_VALUE = this.getFieldValue(Data["Table"][0].LABLE1_ASSIGNTO, Data["Table"][0].LABLE1_TEXT_MAX, '');
          Data["Table"][0].LABLE2_VALUE = this.getFieldValue(Data["Table"][0].LABLE2_ASSIGNTO, Data["Table"][0].LABLE2_TEXT_MAX, '');
          Data["Table"][0].LABLE3_VALUE = this.getFieldValue(Data["Table"][0].LABLE3_ASSIGNTO, Data["Table"][0].LABLE3_TEXT_MAX, '');
          Data["Table"][0].LABLE4_VALUE = this.getFieldValue(Data["Table"][0].LABLE4_ASSIGNTO, Data["Table"][0].LABLE4_TEXT_MAX, '');
          Data["Table"][0].LABLE5_VALUE = this.getFieldValue(Data["Table"][0].LABLE5_ASSIGNTO, Data["Table"][0].LABLE5_TEXT_MAX, '');
          Data["Table"][0].LABLE6_VALUE = this.getFieldValue(Data["Table"][0].LABLE6_ASSIGNTO, Data["Table"][0].LABLE6_TEXT_MAX, '');
          Data["Table"][0].LABLE7_VALUE = this.getFieldValue(Data["Table"][0].LABLE7_ASSIGNTO, Data["Table"][0].LABLE7_TEXT_MAX, '');
          Data["Table"][0].LABLE8_VALUE = this.getFieldValue(Data["Table"][0].LABLE8_ASSIGNTO, Data["Table"][0].LABLE8_TEXT_MAX, '');
          Data["Table"][0].LABLE9_VALUE = this.getFieldValue(Data["Table"][0].LABLE9_ASSIGNTO, Data["Table"][0].LABLE9_TEXT_MAX, '');
          Data["Table"][0].LABLE10_VALUE = this.getFieldValue(Data["Table"][0].LABLE10_ASSIGNTO, Data["Table"][0].LABLE10_TEXT_MAX, '');

          //console.log(Data["Table"][0]);
          let uploadArray = {
            psJSON: JSON.stringify(Data["Table"][0]),
            appSettings: {
              alowSMS: this.KIOSK_PROPERTIES['modules']['SMS']['enable'],
              SMSEndPoint: this.KIOSK_PROPERTIES['modules']['SMS']['apiURL'],
              SMSEndPointId: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointId'],
              SMSEndPointPwd: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPwd'],
              SMSEndPointPort: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPort'],
              SMSContent: this.KIOSK_PROPERTIES['modules']['SMS']['sms_template'],
              printEnable: this.KIOSK_PROPERTIES['modules']['printer']['enable'],
              printerName: this.KIOSK_PROPERTIES['modules']['printer']['printer_name'],
            }
          }
          this.apiServices.PrintVisitorLabel(uploadArray)
            .subscribe((data: any) => {
              console.log(data);
              this.GVisitorPass = "";
              this.GPermittedTime = "";
              _callback(true);
              return;
            },
              err => {
                _callback(false);
                return false;
              });
        } else {
          _callback(false);
          return;
        }
      } else {
        _callback(false);
        return;
      }
    },
      err => {
        console.log("Failed...");
        _callback(false);
        return false;
      });
  }
  getFieldValue(psString, psLength, psCase) {
    var lsReturn = "";

    psString = psString.replace(new RegExp(" ", 'g'), "");
    switch (psString) {
      case "VisitorName":
        lsReturn = (this.GScopeValue.visitorInfo.Name).toString().trim().substring(0, psLength);
        break;
      case "CheckInTime":
        lsReturn = (this.GScopeValue.getDate()).toString().trim().substring(0, psLength);
        break;
      case "Floor":
        lsReturn = (this.GScopeValue.infoData.otherInfo.floorname).toString().trim().substring(0, psLength);
        break;
      case "VisitorNRIC":
        lsReturn = (this.GScopeValue.visitorInfo.Nric).toString().trim().substring(0, psLength);
        break;
      case "VisitorCategory":
        lsReturn = (this.GScopeValue.infoData.VisitorCategoryText).toString().trim().substring(0, psLength);
        break;
      case "VisitorContact":
        lsReturn = (this.GScopeValue.infoData.Contact).toString().trim().substring(0, psLength);
        break;
      case "VImage":
        lsReturn = this.GScopeValue.visitorInfo.ImgSrc;
        break;
      case "VisitorGender":
        lsReturn = (this.GScopeValue.infoData.VisitorGender).toString().trim().substring(0, psLength);
        break;
      case "VisitorCompany":
        lsReturn = (this.GScopeValue.infoData.VisitorCompany).toString().trim().substring(0, psLength);
        break;
      case "VisitorRace":
        lsReturn = (this.GScopeValue.infoData.VisitorRace).toString().trim().substring(0, psLength);
        break;
      case "VisitorState":
        lsReturn = (this.GScopeValue.infoData.VisitorState).toString().trim().substring(0, psLength);
        break;
      case "VisitorCountry":
        lsReturn = (this.GScopeValue.infoData.VisitorCountry).toString().trim().substring(0, psLength);
        break;
      case "VisitorMobile":
        lsReturn = (this.GScopeValue.infoData.Contact).toString().trim().substring(0, psLength);
        break;
      case "VisitorVehicle#":
        lsReturn = (this.GScopeValue.infoData.VehicleNo).toString().trim().substring(0, psLength);
        break;
      case "VisitorPass#":
        lsReturn = (this.GVisitorPass).toString().trim().substring(0, psLength);
        break;
      case "ExpiryTime":
        lsReturn = this.GPermittedTime;
        break;
      case "HostName":
        lsReturn = (this.GScopeValue.infoData.HostNameText).toString().trim().substring(0, psLength);
        break;
      case "HostPurpose":
        lsReturn = (this.GScopeValue.infoData.HostPurposeText).toString().trim().substring(0, psLength);
        break;
      case "HostDepartment":
        lsReturn = (this.GScopeValue.infoData.HostDepartment).toString().trim().substring(0, psLength);
        break;
      case "HostFloor":
        lsReturn = (this.GScopeValue.infoData.HostFloor).toString().trim().substring(0, psLength);
        break;
      case "HostCompany":
        lsReturn = (this.GScopeValue.infoData.HostCompany).toString().trim().substring(0, psLength);
        break;
      case "VisitReason":
        lsReturn = (this.GScopeValue.infoData.HostPurposeText).toString().trim().substring(0, psLength);
        break;
      case "No.OfPerson":
        lsReturn = (this.GScopeValue.infoData.NoOfPerson).toString().trim().substring(0, psLength);
        break;
      case "CheckInLocation":
        lsReturn = (this.GScopeValue.infoData.CheckInLocation).toString().trim().substring(0, psLength);
        break;
      case "ProjectLink":
        lsReturn = "GProURL";
        break;
      case "Day":
        lsReturn = (this.GScopeValue.getDayweek()).toString().trim().substring(0, psLength);
        break;
    }
    return (psCase == "L" ? lsReturn.toLowerCase() : (psCase == "U" ? lsReturn.toUpperCase() : lsReturn));
  }
  loadreceiptprint(poReturnData) {

    if (poReturnData.length > 0) {
      //Required Print Data
      //{"CompanyName":"","Address1":"","Address2":"","Address3":"","CompanyMobile":"","SlipTitle":"","SlipSubTitle_1":"VISITOR DETAILS","SlipSubTitle_2":"CHECK-IN DETAILS","SlipSubTitle_3":"HOST DETAILS","VisitorName":"","VisitorIC":"","VisitorCompany":"","VisitorCategory":"","VisitorContact":"","VisitorVehicle":"","HostPurpose":"","CheckInTime":"","PermittedTime":"","PassNo":"","CheckINLocation":"","CheckINBy":"","NoOfPersons":"","HostName":"","HostCompany":"","HostDepartment":"","Floor":"","PrintType":"OR","Terms1":"","Terms2":"","Terms3":"","Terms4":"","Terms5":"","Message1":"","Message2":"","PrintField":""}

      let poReturnVal = "";
      if (this.CheckInVisitorData != undefined) {
        if (this.CheckInVisitorData.length > 0) {
          if (this.CheckInVisitorData[0].IsDynamicQR) {
            debugger
            poReturnVal = this.CheckInVisitorData[0].EncryptDynQRVal;
          } else if (this.KIOSK_PROPERTIES['modules']['printer']['qrRbar_print_field'] != '') {

            switch (this.KIOSK_PROPERTIES['modules']['printer']['qrRbar_print_field']) {
              case "NRIC":
                poReturnVal = this.getFieldValue("VisitorNRIC", 30, "L") || "";
                break;
              case "VEHICLE_NO":
                poReturnVal = poReturnData[0].VisitorVehicle;
                break;
              case "PASS_NO":
                poReturnVal = poReturnData[0].VisitorPass;
                break;
              case "SMART_NO":
                poReturnVal = poReturnData[0].Smartcard;
                break;
              case "DYNAMIC_HEX":
                poReturnVal = poReturnData[0].DynamicHex;
                break;
              case "DYNAMIC_DEC":
                poReturnVal = parseInt(poReturnData[0].DynamicHex, 16).toString();
                break;
            }
          }
        }
      }
      let setngs = localStorage.getItem('KIOSK_PROPERTIES');
      let CheckINLocation = "";
      if (setngs != undefined && setngs != "") {
        CheckINLocation = JSON.parse(setngs)['kioskName'] || "";
      }

      let preparePrintData = {
        "CompanyName": poReturnData[0]['CompanyName'] || "",
        "Address1": poReturnData[0]['Address1'] || "",
        "Address2": poReturnData[0]['Address2'] || "",
        "Address3": poReturnData[0]['Address3'] || "",
        "CompanyMobile": poReturnData[0]['CompanyMobile'] || "",
        "SlipTitle": poReturnData[0]['SlipTitle'] || "",
        "SlipSubTitle_1": "VISITOR DETAILS",
        "SlipSubTitle_2": "CHECK-IN DETAILS",
        "SlipSubTitle_3": "HOST DETAILS",
        "VisitorName": this.getFieldValue("VisitorName", 30, "L"),
        "VisitorIC": this.getFieldValue("VisitorNRIC", 30, "L") || "",
        "VisitorCompany": this.getFieldValue("VisitorCompany", 30, "L"),
        "VisitorCategory": this.getFieldValue("VisitorCategory", 30, "L"),
        "VisitorContact": this.getFieldValue("VisitorContact", 30, "L"),
        "VisitorVehicle": poReturnData[0]['VisitorVehicle'] || "",
        "HostPurpose": this.getFieldValue("HostPurpose", 30, "L"),
        "CheckInTime": this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a') || "",
        "PermittedTime": poReturnData[0]['PermittedTime'] ? this.datePipe.transform(new Date((poReturnData[0]['PermittedTime']).toString()), 'dd-MM-yyyy hh:mm a') || "" : "",
        "PassNo": poReturnData[0]['PassNo'] || "",
        "CheckINLocation": CheckINLocation,
        "CheckINBy": "VISITOR",
        "NoOfPersons": "1",
        "HostName": this.getFieldValue("HostName", 30, "L"),
        "HostCompany": this.getFieldValue("HostCompany", 30, "L") || "",
        "HostDepartment": this.getFieldValue("HostDepartment", 30, "L") || "",
        "Floor": this.getFieldValue("HostFloor", 30, "L"),
        "PrintType": this.KIOSK_PROPERTIES['modules']['printer']['printer_lab_code'] || "QR",
        "Terms1": poReturnData[0]['Terms1'] || "",
        "Terms2": poReturnData[0]['Terms2'] || "",
        "Terms3": poReturnData[0]['Terms3'] || "",
        "Terms4": poReturnData[0]['Terms4'] || "",
        "Terms5": poReturnData[0]['Terms5'] || "",
        "Message1": poReturnData[0]['Message1'] || "",
        "Message2": poReturnData[0]['Message2'] || "",
        "PrintField": poReturnVal || "",
        "MeetingLoc": poReturnData[0]['MeetingLoc'] || ""
      }
      let uploadArray = {
        psJSON: JSON.stringify(preparePrintData),
        appSettings: {
          alowSMS: this.KIOSK_PROPERTIES['modules']['SMS']['enable'],
          SMSEndPoint: this.KIOSK_PROPERTIES['modules']['SMS']['apiURL'],
          SMSEndPointId: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointId'],
          SMSEndPointPwd: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPwd'],
          SMSEndPointPort: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPort'],
          SMSContent: this.KIOSK_PROPERTIES['modules']['SMS']['sms_template'],
          printEnable: this.KIOSK_PROPERTIES['modules']['printer']['recipt_enable'],
          printerName: this.KIOSK_PROPERTIES['modules']['printer']['printer_receipt_name'],
        }
      }
      console.log(JSON.stringify(uploadArray));
      this.apiServices.PrintVisitorReceipt(uploadArray)
        .subscribe((data: any) => {
          this.GVisitorPass = "";
          this.GPermittedTime = "";
          console.log(data);
          return true;
        },
          err => {
            console.log("Failed...");
            return false;
          });
    }
  }
  /*Load Dynamic Template End*/
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
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
