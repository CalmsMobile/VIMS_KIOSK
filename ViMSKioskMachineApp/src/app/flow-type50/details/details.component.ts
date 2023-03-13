import { HostDetails } from './../../flow-visitor/appointment-detail/appointmentModal';
import { Router } from '@angular/router';
import { Component, OnInit, Inject, HostListener, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AppointmentModal } from '../appointmentModal';
import { BottomSheetPurposeSheet } from 'src/app/flow-visitor/appointment-detail/appointment-detail.component';
import { MatBottomSheet, MatBottomSheetRef, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';


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


  constructor(private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private apiServices: ApiServices) {
    this.isLoading = false;
    this._updateKioskSettings();
    this.aptmDetails = new AppointmentModal();

  }

  ngOnInit() {
    document.getElementById("homeButton").style.display = "none";
    this._initUpdateScanDataValues();
  }
  KIOSK_PROPERTIES: any = {};
  KIOSK_PROPERTIES_LOCAL: any = {};
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
      this.workReferenceNoCaption = "Permit to work Reference Number";
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

      this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.MinLength = 11;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.MinLength = 11;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.MinLength = 5;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.MinLength = 11;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.MinLength = 5;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.MinLength = 4;


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
          break;
        case "Contractor":
          this.departmentShow = false;
          break;
        case "Vendor":
          this.workReferenceNoShow = false;
          this.departmentShow = false;
          break;
        case "Contractor Staff":
          this.LocationOfVisitShow = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show = false;
          this.workReferenceNoShow = false;
          this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Mandatory = true;
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
      }
    }
    //this.router.navigateByUrl('/success')

  }
  _updateVisitorList() {

    let uploadArray: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    if (!this._validateDOCIdinList(this.aptmDetails.id)) {

      let listOfVisitors: any = uploadArray['visitorDetails'];
      this.aptmDetails.checkinCounter = this.KIOSK_CHECKIN_COUNTER_NAME;
      this.aptmDetails['VisitorAnswers'] = JSON.stringify([]);
      listOfVisitors.push(this.aptmDetails);
      uploadArray['visitorDetails'] = listOfVisitors;
      localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));
      return true;
    } else {

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
                //this.proceedThisAttIDsForCheckin(_RESDATA);
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
