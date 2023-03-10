import { Router } from '@angular/router';
import {  Component, OnInit, Inject, HostListener, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AppointmentModal } from '../appointmentModal';
import { BottomSheetPurposeSheet } from 'src/app/flow-visitor/appointment-detail/appointment-detail.component';
import { MatBottomSheet, MatBottomSheetRef, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';

@Component({
  selector: 'app-details-contractor',
  templateUrl: './details-contractor.component.html',
  styleUrls: ['./details-contractor.component.scss']
})
export class DetailsContractorComponent implements OnInit {

  constructor(private router: Router,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private apiServices: ApiServices) {
    this._updateKioskSettings();
    this.aptmDetails = new AppointmentModal();
  }

  ngOnInit() {
    document.getElementById("homeButton").style.display = "none";
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
      this.KIOSK_CHECKIN_COUNTER_NAME = JSON.parse(setngs)['kioskName'];
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.KIOSK_PROPERTIES_LOCAL = JSON.parse(setngs_local);
      /* if (this.KIOSK_PROPERTIES_LOCAL) {
        this.showMultiBranch = this.KIOSK_PROPERTIES_LOCAL.supportMultiBranch;
      } */
      this.KIOSK_PROPERTIES.IsKeyMansIdValidate = JSON.parse(setngs).IsKeyMansIdValidate;
      this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
      if (this.mainModule === 'vcheckin') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.CheckinSettings;
        this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours = {
          Show: false,
          Mandatory: false
        }
        this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video'];
      } else {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.ApptFieldSettings;
        this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video_preappt']
      }
      this.VISITOR_ID_MIN_LENGTH = this.KIOSK_PROPERTIES.CheckinSettings.VisitorId.MinLength;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.MinLength = this.KIOSK_PROPERTIES.CheckinSettings.VisitorId.MinLength;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.MinLength = this.KIOSK_PROPERTIES.CheckinSettings.EmailId.MinLength;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.MinLength = this.KIOSK_PROPERTIES.CheckinSettings.Contact.MinLength;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.MinLength = this.KIOSK_PROPERTIES.CheckinSettings.Company.MinLength;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.MinLength = this.KIOSK_PROPERTIES.CheckinSettings.Name.MinLength;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.MinLength = this.KIOSK_PROPERTIES.CheckinSettings.Vehicle.MinLength;


      this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.MaxLength = 30;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.MaxLength = 50;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.MaxLength = 20;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.MaxLength = 100;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.MaxLength = 50;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.MaxLength = 15;


      //this.calculateNumberofInputs();
    }
  }
  takeActFor(action: String) {
    if (action == 'home')
      this.router.navigateByUrl('/landing');
    if (action == 'back')
      this.router.navigateByUrl('/scan')
    if (action == 'submit')
      this.router.navigateByUrl('/success')
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
}
