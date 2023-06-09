import { Router } from '@angular/router';
import { Component, OnInit, Inject, HostListener, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AppointmentModal } from '../appointmentModal';
import { BottomSheetPurposeSheet } from 'src/app/flow-visitor/appointment-detail/appointment-detail.component';
import { MatBottomSheet, MatBottomSheetRef, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';
import { SettingsService } from 'src/services/settings.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  title = '';
  isLoading = false;
  isDisablename = false;
  isDisableid = false;

  //Location of Visit
  LocationOfVisitShow: boolean;
  LocationOfVisitCaption: string;
  LocationOfVisitMandatory: boolean;
  LocationOfVisitMinLength: number;
  LocationOfVisitMaxLength: number;


  //Permit to work Reference Number
  workReferenceNoShow: boolean;
  workReferenceNoCaption: string;
  workReferenceNoMandatory: boolean;
  workReferenceNoMinLength: number;
  workReferenceNoMaxLength: number;

  //Department
  departmentShow: boolean;
  departmentCaption: string;
  departmentMandatory: boolean;
  departmentMinLength: number;
  departmentMaxLength: number;

  CheckInVisitorData: any = [];

  @ViewChild('cardSerInput') cardSerInput: ElementRef;
  constructor(private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private apiServices: ApiServices,
    private settingsService: SettingsService,
    public datePipe: DatePipe) {
    this.isLoading = false;
    this.aptmDetails = new AppointmentModal();
    this._updateKioskSettings();
    this._initPrintAndCardDispenserValues();
  }
  _initPrintAndCardDispenserValues() {

    setInterval(() => {
      if (this.cardSerInput != undefined)
        this.cardSerInput.nativeElement.focus();
    }, 100);
  }
  ngOnInit() {
    document.getElementById("homeButton").style.display = "none";
    this._initUpdateScanDataValues();
  }
  KIOSK_PROPERTIES: any = {};
  KIOSK_PROPERTIES_LOCAL: any = {};
  serverLog = false;
  aptmDetails: AppointmentModal;
  KIOSK_CHECKIN_COUNTER_NAME: string = "";
  VISITOR_ID_MIN_LENGTH = 0;
  VISITOR_ID_MAX_LENGTH = 30;
  mainModule = '';
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    let setngs_local = localStorage.getItem('KIOSK_PROPERTIES_LOCAL');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.KIOSK_PROPERTIES_LOCAL = JSON.parse(setngs_local);


      this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
      this.title = this.mainModule + " Details";

      //Location Of Visit
      this.LocationOfVisitShow = true;
      this.LocationOfVisitCaption = "Location Of Visit";
      this.LocationOfVisitMandatory = true;
      this.LocationOfVisitMinLength = 5;
      this.LocationOfVisitMaxLength = 30;

      //Permit to work Reference Number
      this.workReferenceNoShow = true;
      this.workReferenceNoCaption = "Permit to Work Reference Number";
      this.workReferenceNoMandatory = false;
      this.workReferenceNoMinLength = 5;
      this.workReferenceNoMaxLength = 30;

      //Department
      this.departmentShow = true;
      this.departmentCaption = "Department";
      this.departmentMandatory = true;
      this.departmentMinLength = 5;
      this.departmentMaxLength = 30;


      this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.CheckinSettings;

      this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Mandatory = false;

      this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.MinLength = 1;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.MinLength = 5;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.MinLength = 1;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.MinLength = 1;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.MinLength = 1;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.MinLength = 1;


      this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.MaxLength = 30;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.MaxLength = 20;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.MaxLength = 100;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.MaxLength = 50;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.MaxLength = 15;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.MaxLength = 15;



      switch (this.mainModule) {
        case "Visitor":
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show = false;
          this.workReferenceNoShow = false;
          this.departmentShow = false;
          this.aptmDetails.category = 'VISITOR';
          this.aptmDetails.categoryId = 'VISIT';
          break;
        case "Contractor":
          this.departmentShow = false;
          this.aptmDetails.category = 'CONTRACTOR';
          this.aptmDetails.categoryId = 'CONTRACTOR';
          break;
        case "Vendor":
          this.workReferenceNoShow = false;
          this.departmentShow = false;
          this.aptmDetails.category = 'VENDOR';
          this.aptmDetails.categoryId = 'VENDOR';
          break;
        case "Contractor Staff":
          this.LocationOfVisitShow = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show = false;
          this.workReferenceNoShow = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Mandatory = true;
          this.aptmDetails.category = 'CONTRACT STAFF';
          this.aptmDetails.categoryId = 'CONTRACTSTAFF';
          break;

        default:
          break;
      }
      this._updateVisitorCheckINSettings();
    }
  }
  _updateVisitorCheckINSettings() {
    let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY") || "{}");
    uploadArray['appSettings'] = {
      alowSMS: this.KIOSK_PROPERTIES['modules']['SMS']['enable'],
      SMSEndPoint: this.KIOSK_PROPERTIES['modules']['SMS']['apiURL'],
      SMSEndPointId: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointId'],
      SMSEndPointPwd: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPwd'],
      SMSEndPointPort: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPort'],
      SMSContent: this.KIOSK_PROPERTIES['modules']['SMS']['sms_template'],
      printEnable: this.KIOSK_PROPERTIES['modules']['printer']['enable'],
      printerName: this.KIOSK_PROPERTIES['modules']['printer']['printer_name'],
    }
    localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));

    /*  if (!this.KIOSK_PROPERTIES['CheckinSettings']['Purpose']['Show']) {
       this.aptmDetails.purpose = this.KIOSK_PROPERTIES['CheckinSettings']['Purpose']['default'];
     }
     if (!this.KIOSK_PROPERTIES['CheckinSettings']['Host']['Show']) {
       this.aptmDetails.hostDetails.name = this.KIOSK_PROPERTIES['CheckinSettings']['Host']['default'];
       this.aptmDetails.hostDetails.id = "0";
     } */
  }
  _initUpdateScanDataValues() {
    if (localStorage.getItem("VISI_SCAN_DOC_DATA") != undefined
      && localStorage.getItem("VISI_SCAN_DOC_DATA") != "") {
      let doc_detail = JSON.parse(localStorage.getItem("VISI_SCAN_DOC_DATA"));
      this.aptmDetails.name = doc_detail["visName"];
      this.aptmDetails.id = doc_detail["visDOCID"];

      if (this.aptmDetails.name) {
        this.isDisablename = true;
      }
      if (this.aptmDetails.id) {
        this.isDisableid = true;
      }

    }
  }
  takeActFor(action: String) {
    if (action == 'home')
      this.router.navigateByUrl('/landing');
    if (action == 'back')
      this.router.navigateByUrl('/scan')
    if (action == 'submit') {
      // addAttendanceForVisitor();
      this.isLoading = true;
      if (this._updateVisitorList()) {
        console.log(localStorage.getItem("VISI_LIST_ARRAY"));
        let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
        this.addAttendanceForVisitor(uploadArray);
        /*  this.isLoading = false;
         this.router.navigateByUrl('/success'); */
      }
    }


  }
  _updateVisitorList() {
    debugger
    let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    if (!this._validateDOCIdinList(this.aptmDetails.id)) {
      debugger
      let listOfVisitors: any = uploadArray['visitorDetails'];
      this.aptmDetails.checkinCounter = this.KIOSK_CHECKIN_COUNTER_NAME;
      this.aptmDetails['VisitorAnswers'] = JSON.stringify([]);
      this.aptmDetails.hostDetails.name = this.aptmDetails.hostName;
      listOfVisitors.push(this.aptmDetails);
      uploadArray['visitorDetails'] = listOfVisitors;
      localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));
      return true;
    } else {
      debugger
      return false;
    }
  }
  _validateDOCIdinList(visitorID: any) {

    let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    let listOfVisitors: any = uploadArray['visitorDetails'];
    let _flag = false;
    for (let m = 0; m < listOfVisitors.length; m++) {
      if (listOfVisitors[m]['id'] == visitorID) {
        _flag = true;
      }
    }
    return _flag;
  }
  addAttendanceForVisitor(uploadArray) {
    var _callErrorMsg = () => {

      //this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg2'];
      const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
        data: { "title": this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg2'], "subTile": "Please try again or Contact Reception" }
      });
      dialogRef.afterClosed().subscribe((data) => {
        this.router.navigateByUrl('/landing');
      });
    }
    this.apiServices.localPostMethod("AddAttendanceForVisitor_Glen", uploadArray).subscribe((data: any) => {

      console.log("============data" + data);
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let _RETdata = data[0]["Data"];
        if (_RETdata != "") {
          let Data = JSON.parse(_RETdata) || [];
          console.log(Data);
          if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {
            if (Data["Table1"] != undefined && Data["Table1"].length > 0) {
              debugger
              let _RESDATA = Data["Table1"];
              if (_RESDATA.length > 0) {
                debugger
                this.proceedThisAttIDsForCheckin(_RESDATA);
                //this.isLoading = false;
                //this.router.navigateByUrl('/success');
              }
            }
          } else if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 70) {
            /* const dialogRef = this.dialog.open(DialogAppCommonDialog, {
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
            }); */
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
  private proceedThisAttIDsForCheckin(att_IDs: any) {
    debugger
    let i = 0, suc_flag = 0;
    let _callNext = () => {
      if (i < att_IDs.length) {
        debugger
        this.chk_hardwares_to_finish(att_IDs[i]['att_id'], att_IDs[i], (status: boolean) => {
          if (status) {
            suc_flag++;
          }
          i++;
          _callNext();
          return;
        });
      } else {
        //this._finish_with_success_msg();
        this.isLoading = false;
      }
    }
    _callNext();
  }

  //-------------------- Hardware Services --------------------
  private chk_hardwares_to_finish(att_id: string, _visitorData: any, _nextElemcallBack: any) {
    debugger
    console.log(JSON.stringify(_visitorData));
    let _Modules = this.KIOSK_PROPERTIES['modules'];
    if (this.KIOSK_PROPERTIES_LOCAL) {
      this.serverLog = this.KIOSK_PROPERTIES_LOCAL.serverLog;
    }

    let _get_cardSerial_number_type1 = (_callback: any) => {
      debugger
      let _this = this;
      let setngs = localStorage.getItem('KIOSK_PROPERTIES');
      let _cardDcom = JSON.parse(setngs)["kioskSetup"].modules['card_dispenser']['COM_Port'] || "";
      let timeOut = AppSettings.APP_DEFAULT_SETTIGS.Card_dispenser_time;
      if (this.mainModule == "Visitor" || this.mainModule == "Vendor") {
        _cardDcom = AppSettings['APP_SERVICES']['V_type_port'];
      } else if (this.mainModule == "Contractor" || this.mainModule == "Contractor Staff") {
        _cardDcom = AppSettings['APP_SERVICES']['C_type_port'];
      }
      console.log("_cardDcom", _cardDcom)
      this.apiServices.localGetMethod("CD_OpenPort", _cardDcom).subscribe(async (data: any) => {
        if (_this.serverLog) (await this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_OpenPort", "router": this.router.url, "lineNo": 531, "message": "" }))).subscribe((data: any) => console.log("AddLogs status=" + data));
        debugger
        console.log("CD_OpenPort data " + data);
        if (data.length > 0 && data[0]['Data'] != null) {
          debugger
          let cardStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
          console.log("CD_OpenPort cardStatus " + cardStatus);
          if (cardStatus["ResponseStatus"] > 0) {
            this.apiServices.localGetMethod("CD_PreSend", "").subscribe(async (data: any) => {
              console.log("CD_PreSend data " + data);
              if (_this.serverLog) (await this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_PreSend", "router": this.router.url, "lineNo": 541, "message": "" }))).subscribe((data: any) => console.log("AddLogs status=" + data));
              debugger
              if (data.length > 0 && data[0]['Data'] != null) {
                let cardMoveStatus = JSON.parse(data[0]['Data']);
                if (cardMoveStatus['ResponseStatus'] == "0") {
                  debugger
                  let reCheck = true;
                  //let i = 0;
                  //let max = 1;
                  (function repeat() {
                    //if (++i > max) _callback(false, "0");
                    setTimeout(function () {
                      //console.log("waited for: " + i + " seconds");
                      debugger
                      if (_this.cardSerInput.nativeElement.value != null && _this.cardSerInput.nativeElement.value != "" || _this.cardSerInput.nativeElement.value.length > 2) {
                        debugger
                        console.log("CD_ card number " + _this.cardSerInput.nativeElement.value);
                        if (_this.cardSerInput.nativeElement.value.length == 10)
                          _callback(true, _this.cardSerInput.nativeElement.value);
                        else {
                          if (reCheck) {
                            reCheck = false;
                            repeat()
                          }
                          else {
                            _this.apiServices.localGetMethod("CD_RecycleBack", "").subscribe((data: any) => {
                              if (_this.serverLog) this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_RecycleBack", "router": this.router.url, "lineNo": 584, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                              debugger
                              _callback(false, "0");
                            }, err => {
                              debugger
                              _callback(false, "0");
                            });
                          }
                        }
                      }
                      else {
                        debugger
                        _this.apiServices.localGetMethod("CD_RecycleBack", "").subscribe((data: any) => {
                          if (_this.serverLog) this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_RecycleBack", "router": this.router.url, "lineNo": 557, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                          debugger
                          _callback(false, "0");
                        }, err => {
                          debugger
                          _callback(false, "0");
                        });
                      }
                    }, timeOut);
                  })();
                  /* setTimeout(function () {
                    debugger
                    if (_this.cardSerInput.nativeElement.value != null && _this.cardSerInput.nativeElement.value != "" || _this.cardSerInput.nativeElement.value.length > 2) {
                      debugger
                      console.log("CD_ card number " + _this.cardSerInput.nativeElement.value);
                      _callback(true, _this.cardSerInput.nativeElement.value);
                    }
                    else {
                      debugger
                      _this.apiServices.localGetMethod("CD_RecycleBack", "").subscribe((data: any) => {
                        if(_this.serverLog) this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_RecycleBack", "router": this.router.url, "lineNo": 557, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                        debugger
                        _callback(false, "0");
                      }, err => {
                        debugger
                        _callback(false, "0");
                      });
                    }
                  }, timeOut); */
                } else {
                  debugger
                  _callback(false, "0");
                  return;
                }
              } else {
                debugger
                _callback(false, "0");
                return;
              }
            },
              err => {
                debugger
                _callback(false, "0");
                return false;
              });
          }
          else {
            debugger
            _callback(false, "0");
            return;
          }
        } else {
          debugger
          _callback(false, "0");
          return;
        }
      },
        err => {
          debugger
          _callback(false, "0");
          return false;
        });

    }
    if ((_Modules['card_dispenser']['enable'])) {
      debugger
      if (_Modules['card_dispenser']['dispenser_type'] == 'TYPE1') {
        _get_cardSerial_number_type1((status: boolean, serial: string) => {
          //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "_get_cardSerial_number_type1", "router": this.router.url, "lineNo": 613, "status": status })).subscribe((data: any) => console.log("AddLogs status=" + data));
          debugger
          if (status) {
            //Update Visitor Card Serial Number
            this.visitorIndividualCheckIn(att_id, serial, (status: any, visitorData: any) => {
              let _preparePrintLabel = (cardDProcessStatus: boolean) => {
                this.settingsService._kiosk_Minus1AvailCard((_minStatus: boolean) => { })

                if (visitorData.length > 0) {

                  this.isLoading = false;
                  this.router.navigateByUrl('/success');
                  _nextElemcallBack(true);
                  return;
                } else {
                  _nextElemcallBack(false);
                  return;
                }
              }
              // If Success Eject Visitor Card
              debugger
              if (status['s'] === true) {
                this.apiServices.localGetMethod("CD_DispenseCard", "").subscribe((data: any) => {
                  //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_DispenseCard", "router": this.router.url, "lineNo": 654, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                  if (data.length > 0 && data[0]['Data'] != "") {
                    let cardEjectStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
                    if (cardEjectStatus['ResponseStatus'] == "0") {
                      // If Eject Success Proceed Next Visitor attendance ID
                      this.apiServices.localGetMethod("CD_ComClose", "").subscribe((data: any) => {
                        //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_ComClose", "router": this.router.url, "lineNo": 660, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                        debugger
                      }, err => {
                        debugger
                      });
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
              } else {
                this.apiServices.localGetMethod("CD_RecycleBack", "").subscribe((data: any) => {
                  //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_RecycleBack", "router": this.router.url, "lineNo": 678, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                  this.apiServices.localGetMethod("CD_ComClose", "").subscribe((data: any) => {
                    //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_ComClose", "router": this.router.url, "lineNo": 680, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                    debugger
                  }, err => {
                    debugger
                  });
                }, err => {
                  this.apiServices.localGetMethod("CD_ComClose", "").subscribe((data: any) => {
                    //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_ComClose", "router": this.router.url, "lineNo": 687, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
                    debugger
                  }, err => {
                    debugger
                  });
                });
                const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
                  data: { "title": "Please contact reception !", "subTile": "Visitor checkin has been failed (Unable to dispense card)", "ok": "Ok" },
                  disableClose: true
                });
                dialogRef.afterClosed().subscribe((data) => {
                  this.router.navigate(['/landing']);
                });

              }
            });

          } else {
            this.apiServices.localGetMethod("CD_ComClose", "").subscribe((data: any) => {
              //this.apiServices.sendLogToServer("Card Dispenser", JSON.stringify({ "service": "CD_ComClose", "router": this.router.url, "lineNo": 708, "message": "" })).subscribe((data: any) => console.log("AddLogs status=" + data));
              debugger
            }, err => {
              debugger
            });
            const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
              data: { "title": "Please contact reception !", "subTile": "Visitor checkin has been failed (Unable to dispense card)", "ok": "Ok" },
              disableClose: true
            });
            dialogRef.afterClosed().subscribe((data) => {
              this.router.navigate(['/landing']);
            });
          }
        });
      }
    } else {
      this.visitorIndividualCheckIn(att_id, "", (status: any, visitorData: any) => {
        let _preparePrintLabel = (cardDProcessStatus: boolean) => {
          this.settingsService._kiosk_Minus1AvailCard((_minStatus: boolean) => { })

          if (visitorData.length > 0) {

            this.isLoading = false;
            this.router.navigateByUrl('/success');
            _nextElemcallBack(true);
            return;
          } else {
            _nextElemcallBack(false);
            return;
          }
        }
        debugger
        if (status['s'] === true) {
          _preparePrintLabel(true);
        } else {

          const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
            data: { "title": "Please contact reception !", "subTile": "Visitor checkin has been failed", "ok": "Ok" },
            disableClose: true
          });
          dialogRef.afterClosed().subscribe((data) => {
            this.router.navigate(['/landing']);
          });

        }
      });
    }
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
    // this.EnableAcsQrCode = (typeof (this.KIOSK_PROPERTIES['modules']['ACS']) == 'undefined' ? false : this.KIOSK_PROPERTIES['modules']['ACS']['EnableAcsQrCode']);
    // this.LabelPrintEnable = this.KIOSK_PROPERTIES['modules']['printer']['enable'];
    // this.ReceiptPrintEnable = this.KIOSK_PROPERTIES['modules']['printer']['recipt_enable'];
    // this.LabelPrintManualOrAuto = typeof (this.KIOSK_PROPERTIES['modules']['printer']['print_option']) == 'undefined' ? 20 : this.KIOSK_PROPERTIES['modules']['printer']['print_option'];
    //console.log("LabelPrintManualOrAuto " + this.LabelPrintManualOrAuto + this.LabelPrintEnable);
    //console.log("ReceiptPrintEnable " + this.ReceiptPrintEnable);
    this.apiServices.localPostMethod("visitorIndividualCheckIn", prepareData).subscribe((data: any) => {
      console.log(data);
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        let Data = JSON.parse(data[0]["Data"]);
        if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {
          if (Data["Table1"] != undefined && Data["Table1"].length > 0) {
            this.CheckInVisitorData = Data["Table1"];
            /*  this.DisplayImageHandlerURL = this.getImageHandlerURL();
             if (!this.EnableAcsQrCode || !this.DisplayImageHandlerURL) {
               this.qrcodeProcessed = true;
             } */
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
  openBottomPurposeSheet(): void {
    const purpose = this.bottomSheet.open(BottomSheetPurposeSheet);
    purpose.afterDismissed().subscribe(result => {
      if (result != undefined) {
        this.aptmDetails.purpose = result['visitpurpose_desc'];
        this.aptmDetails.purposeId = result['visitpurpose_id'];
      }
    });
  }
  textDataBindTemp(value: string, elm: string) {
    console.log(value);
    this['aptmDetails'][elm] = value;
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
    @Inject(MAT_DIALOG_DATA) public data) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
