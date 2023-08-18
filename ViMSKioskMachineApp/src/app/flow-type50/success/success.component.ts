import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';
import { DialogSuccessMessagePage } from '../details/details.component';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  isLoading: boolean = false;

  @ViewChild('cardSerInput') cardSerInput: ElementRef;

  RESULT_MSG = "";
  RESULT_MSG2 = "";
  RESULT_MSG3 = "";
  mainModule: string;
  dialog: MatDialog;
  constructor(private router: Router,
    private apiServices: ApiServices) {
    this._updateKioskSettings();
  }

  ngOnInit() {
    document.getElementById("homeButton").style.display = "none";

  }
  takeActFor(action: String) {
    if (action == 'ok') {
      this.router.navigateByUrl('/landing');
    } else if (action === 'home') {
      this.router.navigateByUrl('/landing');
    } else if (action === 'addWorker') {

      localStorage.setItem("_PURPOSE_OF_VISIT", "[]");
      localStorage.setItem("VISI_SCAN_DOC_DATA", "");
      localStorage.setItem("VISI_HOST_MOB_NUM", "");
      localStorage.setItem("VISI_LIST_ARRAY", "{\"appSettings\":{}, \"visitorDetails\" :[]}");

      this.router.navigateByUrl('/scan');
    }

  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      console.log(this.KIOSK_PROPERTIES);

      switch (localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE)) {
        case 'Visitor':
          this.RESULT_MSG = "Visitor Successfully Checked In!";
          this.RESULT_MSG2 = "Please collect your Pass from the dispenser,<br>and then proceed to gantry to scan the pass for entry.";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be imposed";
          break;
        case 'Contractor':
          this.RESULT_MSG = "Contractor Successfully Checked In!";
          this.RESULT_MSG2 = "Please proceed to FM Office to obtain Permit to Work<br>and bring the form to Security counter and place it in the box.<br>Please proceed to gantry and scan the pass for entry";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be imposed";
          break;
        case 'Vendor':
          this.RESULT_MSG = "Vendor Successfully Checked In";
          this.RESULT_MSG2 = "Please collect your pass from the dispenser,<br>and then proceed to gantry to scan the pass for entry";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be imposed"
          break;
        case 'Contract Staff':
          this.RESULT_MSG = "Contract Staff Successfully Checked In";
          this.RESULT_MSG2 = "Please collect your pass from the dispenser,<br>and then proceed to gantry to scan the pass for entry<br><br>If the access card is required, please proceed to the Security Counter";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be imposed"
          break;

        default:
          this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg1'];
          this.RESULT_MSG2 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_message_mid'];
          this.RESULT_MSG3 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_message_last'];
          break;
      }

    }
  }

}
