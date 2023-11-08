import { Component, OnInit, Inject, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatBottomSheet, MatDialog, MatInput } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { SettingsService } from '../../../services/settings.service';
import { appConfirmDialog } from '../flow-visitor.component';
import { KeboardBottomSheetComponent } from '../keboard-bottom-sheet/keboard-bottom-sheet.component';

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
  APONTMNT_NRIC: any = "";
  APONTMNT_EMAIL: any = "";
  selectedType = '';
  selectedIndex = 0;
  showScanButton = false;
  purposes = [];
  qrScanAppointmentId = false;
  //KIOSK_PROPERTIES_LOCAL: any = {};
  isBackButtonVisible = false;
  @ViewChild("nric") nric: ElementRef;
  @ViewChild("contact") contact: ElementRef;
  @ViewChild('email') email: ElementRef;
  @ViewChild('appint_id') appint_id: ElementRef;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private apiServices: ApiServices) {
    let listOFvisitors: any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    this.totalVisitors = listOFvisitors['visitorDetails'].length;
    this._updateKioskSettings();

    /*  this.APONTMNT_CODE = '3805639620';
     this.selectedType = 'appint_id';
     this.getAppointmentDetails(); */
  }
  selectedTabValue(event) {
    console.log(event);
    if (event.tab.textLabel == this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.title_caption) {
      this.selectedType = 'nric';
      this.showScanButton = false;
      this.openKeyBoard(
        this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.field_caption,
        this.APONTMNT_NRIC);
      setTimeout(() => {
        this.nric.nativeElement.focus()
      });
    }
    if (event.tab.textLabel == this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.title_caption) {
      this.selectedType = 'contact';
      this.showScanButton = false;
      this.openKeyBoard(
        this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.field_caption,
        this.APONTMNT_CONTACT);
      setTimeout(() => {
        this.contact.nativeElement.focus()
      });
    }
    if (event.tab.textLabel == this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.title_caption) {
      this.selectedType = 'email';
      this.showScanButton = false;
      this.openKeyBoard(
        this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.field_caption,
        this.APONTMNT_EMAIL);
      setTimeout(() => {
        this.email.nativeElement.focus()
      });
    }
    if (event.tab.textLabel == this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.title_caption) {
      this.selectedType = 'appint_id';
      if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.WebCamScan.enable)
        this.showScanButton = true;
      if (!this.qrScanAppointmentId)
        this.openKeyBoard(
          this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.field_caption,
          this.APONTMNT_CODE);
      setTimeout(() => {
        this.appint_id.nativeElement.focus()
      });
    }


  }
  /*  selectedTabValue(event) {
     console.log(event.index);
     if (event.index == 0) {
       this.selectedType = "nric";
       setTimeout(() => {
         this.nric.nativeElement.focus()
       })
     }
     if (event.index == 1) {
       this.selectedType = "contact";
       setTimeout(() => {
         this.contact.nativeElement.focus()
       })
     }
     if (event.index == 2) {
       this.selectedType = "email";
       setTimeout(() => {
         this.email.nativeElement.focus()
       })
     }
     if (event.index == 3) {
       this.selectedType = "appint_id";
       setTimeout(() => {
         this.appint_id.nativeElement.focus()
       })
     }
     console.log(this.selectedType)
   } */
  ngOnInit() {
    if (localStorage.getItem('_PURPOSE_OF_VISIT') != undefined && localStorage.getItem('_PURPOSE_OF_VISIT') != '') {
      this.purposes = JSON.parse(localStorage.getItem('_PURPOSE_OF_VISIT'));
    }
    /* let setngs_local = localStorage.getItem('KIOSK_PROPERTIES_LOCAL');
    this.KIOSK_PROPERTIES_LOCAL = JSON.parse(setngs_local);
    if(this.KIOSK_PROPERTIES_LOCAL!= undefined){
      this.qrScanAppointmentId = this.KIOSK_PROPERTIES_LOCAL.qrScanAppointmentId;
    } */
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
    localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", "");
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.AppointmentSettings;
      if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable && this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.search_type === "QRCode") {
        this.qrScanAppointmentId = true;
      }
      this.selTab();
      //this.selectTab();
    }
  }
  selTab() {
    if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable || this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable ||
      this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable ||
      this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {

      this.selectedIndex = 0;
      if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable) {
        this.selectedType = 'nric';
        this.openKeyBoard(
          this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.field_caption,
          this.APONTMNT_NRIC);
        setTimeout(() => {
          this.nric.nativeElement.focus();
        });
      }
      else if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable) {
        this.selectedType = 'contact';
        this.openKeyBoard(
          this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.field_caption,
          this.APONTMNT_CONTACT);
        setTimeout(() => {
          this.contact.nativeElement.focus()
        });
      }
      else if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable) {
        this.selectedType = 'email';
        this.openKeyBoard(
          this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.field_caption,
          this.APONTMNT_EMAIL);
        setTimeout(() => {
          this.email.nativeElement.focus()
        });
      }
      else if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
        this.selectedType = 'appint_id';
        if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.WebCamScan.enable)
          this.showScanButton = true;
        if (!this.qrScanAppointmentId)
          this.openKeyBoard(
            this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.field_caption,
            this.APONTMNT_CODE);
        setTimeout(() => {
          this.appint_id.nativeElement.focus()
        });
      }

    }
  }
  /*  selectTab() {
     if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "nric";
       setTimeout(() => {
         this.selectedIndex = 0;
         this.nric.nativeElement.focus()
       })
     } else if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "contact";
       setTimeout(() => {
         this.selectedIndex = 1;
         this.contact.nativeElement.focus()
       })
     } else if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "email";
       setTimeout(() => {
         this.selectedIndex = 2;
         this.email.nativeElement.focus()
       })
     } else if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "appint_id";
       setTimeout(() => {
         this.selectedIndex = 3;
         this.appint_id.nativeElement.focus()
       })
     } else if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "nric";
       setTimeout(() => {
         this.selectedIndex = 0;
         //this.email.nativeElement.focus()
       })
     } else if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "contact";
       setTimeout(() => {
         this.selectedIndex = 1;
         //this.email.nativeElement.focus()
       })
     } else if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "email";
       setTimeout(() => {
         this.selectedIndex = 2;
         //this.email.nativeElement.focus()
       })
     } else if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.NRIC.enable && !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Contact.enable &&
       !this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.Email.enable &&
       this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentSearch.AppointmentID.enable) {
       this.selectedType = "appint_id";
       setTimeout(() => {
         this.selectedIndex = 3;
         //this.email.nativeElement.focus()
       })
     }
   } */
  takeActFor(action: string) {
    if (action === "getAppointmentDetail") {
      this.getAppointmentDetails();
    } else if (action === "back") {
      this.router.navigateByUrl('/landing');
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
      this.APONTMNT_NRIC = "";
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

  textDataBindNric(value: string) {
    console.log(value);
    this.APONTMNT_NRIC = value;
  }
  textDataBindContact(value: string) {
    console.log(value);
    this.APONTMNT_CONTACT = value;
  }

  textDataBindEmail(value: string) {
    console.log(value);
    this.APONTMNT_EMAIL = value;
  }
  onInput(value: string) {

    if (value != "" && value.length > 1) {
      console.log("onInput " + value)
      this.takeActFor('getAppointmentDetail')
    }
  }
  getAppointmentDetails() {
    document.getElementById("bodyloader").style.display = "block";
    let prepareData: any = "";
    if (this.selectedType == "nric") {

      prepareData = { "nric": this.APONTMNT_NRIC, "att_appointment_id": "", "ContactNo": "", "Email": "" };
    } else if (this.selectedType == "contact") {

      prepareData = { "nric": "", "att_appointment_id": "", "ContactNo": this.APONTMNT_CONTACT, "Email": "" };
    } else if (this.selectedType == "email") {

      prepareData = { "nric": "", "att_appointment_id": "", "ContactNo": "", "Email": this.APONTMNT_EMAIL };
    } else if (this.selectedType == "appint_id") {

      prepareData = { "nric": "", "att_appointment_id": (this.APONTMNT_CODE).toString(), "ContactNo": "", "Email": "" };
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
              /* _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
              _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
              _app_details['aptid'] = _app_details.ApptmentId.toString();
              localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));
              this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } }); */
              if (_app_details['AllowedVisits'] > 0) {
                if (_app_details['UsedCount'] > 0 && _app_details['AllowedVisits'] <= _app_details['UsedCount']) {
                  //<Message> = "The maximum number of check-ins for this appointment has been reached, so you won't be able to check-in using this appointment. Please contact host or reception desk for further assistance.";
                  this.dialog.open(appConfirmDialog, {
                    width: '250px',
                    data: { title: "The maximum number of check-ins for this appointment has been reached, so you won't be able to check-in using this appointment. Please contact host or reception desk for further assistance.", btn_ok: "Ok" }
                  });
                } else {
                  _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
                  _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
                  _app_details['aptid'] = _app_details.ApptmentId.toString();
                  localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));
                  /* if (this.KIOSK_PROPERTIES.COMMON_CONFIG.id_verification.enable) {
                    this.router.navigateByUrl('/visitorRegisType');
                  } else { */
                    this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });
                  //}

                }
              } else {
                _app_details.purposeDesc = this.getPurposeName(_app_details.purpose, false);
                _app_details.purposeId = this.getPurposeName(_app_details.purpose, true);
                _app_details['aptid'] = _app_details.ApptmentId.toString();
                localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));
                /* if (this.KIOSK_PROPERTIES.COMMON_CONFIG.id_verification.enable) {
                  this.router.navigateByUrl('/visitorRegisType');
                } else { */
                  this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });
               // }
              }
            } else {
              this.router.navigate(['/appointmentList'], { queryParams: { data: JSON.stringify(Data["Table1"])} });
            }

          } else {
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: { title: this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle.appt_not_found_desc, btn_ok: "Ok" }
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
          data: { title: this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle.appt_not_found_desc, btn_ok: "Ok" }
        });
      }
    },
      err => {
        document.getElementById("bodyloader").style.display = "none";
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: this.KIOSK_PROPERTIES.COMMON_CONFIG.AdditionalTitle.appt_not_found_desc, btn_ok: "Ok" }
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

  openKeyBoard(field_caption, value) {
    //this.selectedType = selectedType;
    const host = this.bottomSheet.open(KeboardBottomSheetComponent, {
      panelClass: this.selectedType == "contact" ? 'keyboard-numeric-bottom-sheet' : 'keyboard-normal-bottom-sheet',
      data: {
        mode: this.selectedType == "contact" ? "numeric" : "other",
        value: value,
        field_caption: field_caption
      }
    });
    host.afterDismissed().subscribe(result => {
      if (result != undefined) {
        console.log(result);

        if (this.selectedType == 'nric') {
          setTimeout(() => {
            this.APONTMNT_NRIC = result;
            this.nric.nativeElement.focus()
          });
        }

        if (this.selectedType == 'contact') {
          setTimeout(() => {
            this.APONTMNT_CONTACT = result;
            this.contact.nativeElement.focus()
          });
        }
        if (this.selectedType == 'email') {
          setTimeout(() => {
            this.APONTMNT_EMAIL = result;
            this.email.nativeElement.focus()
          });
        }
        if (this.selectedType == 'appint_id') {
          setTimeout(() => {
            this.APONTMNT_CODE = result;
            this.appint_id.nativeElement.focus()
          });
        }


      }
    });
  }
}
