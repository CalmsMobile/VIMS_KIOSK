import { Component, OnInit, Inject, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatInput } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { SettingsService } from '../../../services/settings.service';
import { appConfirmDialog } from '../flow-visitor.component';

@Component({
  selector: 'app-visitor-pre-apontmnt',
  templateUrl: './visitor-pre-apontmnt.component.html',
  styleUrls: ['./visitor-pre-apontmnt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VisitorPreApontmntComponent implements OnInit {
  scanData: any = '';
  totalVisitors: number = 0;
  APONTMNT_CODE: any = "";
  APONTMNT_CONTACT: any = "";
  APONTMNT_EMAIL: any = "";
  selectedType = 'contact';
  purposes = [];
  @ViewChild("contact") contact: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('appint_id') appint_id: ElementRef;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private settingService: SettingsService,
    private dialog: MatDialog,
    private apiServices: ApiServices) {
    let listOFvisitors: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    this.totalVisitors = listOFvisitors['visitorDetails'].length;
    this._updateKioskSettings();
    this.APONTMNT_CODE = '';
    
  }
  selectedTabValue(event) {
    console.log(event.index);
    if (event.index == 0) {
      this.selectedType = "contact";
      setTimeout(()=>{
        this.contact.nativeElement.focus()
    })
    }
    if (event.index == 1) {
      this.selectedType = "email";
      setTimeout(()=>{
        this.email.nativeElement.focus()
    })
    }
    if (event.index == 2) {
      this.selectedType = "appint_id";
      setTimeout(()=>{
        this.appint_id.nativeElement.focus()
    })
      }
    console.log(this.selectedType)
  }
  ngOnInit() {
    if (localStorage.getItem('_PURPOSE_OF_VISIT') != undefined && localStorage.getItem('_PURPOSE_OF_VISIT') != '') {
      this.purposes = JSON.parse(localStorage.getItem('_PURPOSE_OF_VISIT'));
    }
    this._getAllPurposeOfVisit();
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        console.log(JSON.stringify(params));
        this.scanData = params['scanData'];
        if (this.scanData != undefined && this.scanData != '') {
          this.selectedType = "appint_id";
          this._goAndGetAppointmentDetails();
        }
      });
  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
  takeActFor(action: string) {
    if (action === "getAppointmentDetail") {
      this.getAppointmentDetails();
    } else if (action === "back") {
      if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license) &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
        this.router.navigateByUrl('/landing')
      } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
        this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
        this.router.navigateByUrl('/landing')
      } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
        this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
        this.router.navigateByUrl('/landing')
      } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
        this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
        this.router.navigateByUrl('/landing')
      } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
        !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
        this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
        this.router.navigateByUrl('/landing');
      } else {
        this.router.navigateByUrl('/visitorRegisType');
      }
    } else if (action === "home") {
      this.router.navigateByUrl('/landing')
    } else if (action == "scanNow") {
      this.router.navigate(['/scanQRCode'], { queryParams: { scanType: 'PREAPPOINTMT' } });
    }
  }

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

  _goAndGetAppointmentDetails() {
    // {"aptid":"19","aptgid":"20190204110305","cid":"1"}
    try {
      //let _scanData:any = this.settingService._decrypt(this.scanData);
      // _scanData = (_scanData != "") ? JSON.parse(_scanData) : {};
      //console.log(_scanData);
      // this.APONTMNT_CODE = _scanData['aptid'] || '';

      this.APONTMNT_CODE = this.scanData;
      this.APONTMNT_CONTACT = "";
      this.APONTMNT_EMAIL = "";
      this.takeActFor('getAppointmentDetail');
    } catch (ex) {
      console.log("Invalid Code");
    }
  }
  textDataBindTemp(value: string) {
    console.log(value);
    this.APONTMNT_CODE = value;
  }

  textDataBindContact(value: string) {
    console.log(value);
    this.APONTMNT_CONTACT = value;
  }

  textDataBindEmail(value: string) {
    console.log(value);
    this.APONTMNT_EMAIL = value;
  }
  getAppointmentDetails() {
    document.getElementById("bodyloader").style.display = "block";
    let prepareData: any = "";
    if (this.selectedType == "contact") {
      debugger
      prepareData = { "att_appointment_id": "", "ContactNo": this.APONTMNT_CONTACT, "Email": "" };
    } else if (this.selectedType == "email") {
      debugger
      prepareData = { "att_appointment_id": "", "ContactNo": "", "Email": this.APONTMNT_EMAIL };
    } else if (this.selectedType == "appint_id") {
      debugger
      prepareData = { "att_appointment_id": (this.APONTMNT_CODE).toString(), "ContactNo": "", "Email": "" };
    }
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
              _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
              _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
              _app_details['aptid'] = _app_details.ApptmentId.toString();
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });
            } else {
              this.router.navigate(['/appointmentList'], { queryParams: { data: JSON.stringify(Data["Table1"]) } });
            }

          } else {
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: { title: "Appointment record not found", btn_ok: "Ok" }
            });
          }
        } else {
          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: { title: Data["Table"][0]['description'], btn_ok: "Ok" }
          });
        }
      } else {
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: "Appointment record not found", btn_ok: "Ok" }
        });
      }
    },
      err => {
        document.getElementById("bodyloader").style.display = "none";
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: "Appointment record not found", btn_ok: "Ok" }
        });
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
}
