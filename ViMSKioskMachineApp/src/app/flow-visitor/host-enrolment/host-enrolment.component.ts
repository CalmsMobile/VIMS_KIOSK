import { Component, OnInit, Inject, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatBottomSheet, MatDialog, MatInput } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { SettingsService } from '../../../services/settings.service';
import { appConfirmDialog } from '../flow-visitor.component';
import { KeboardBottomSheetComponent } from '../keboard-bottom-sheet/keboard-bottom-sheet.component';

@Component({
  selector: 'app-host-enrolment',
  templateUrl: './host-enrolment.component.html',
  styleUrls: ['./host-enrolment.component.scss']
})
export class HostEnrolmentComponent implements OnInit {

  searchText = '';

  constructor(private router: Router,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private apiServices: ApiServices) {


    this._updateKioskSettings();


  }

  ngOnInit() {

  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", "");
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.HostEnrolmentSettings;
    }
  }
  takeActFor(action: string) {
    if (action === "getHostDetail") {
      this.getHostDetail();
    } else if (action === "back") {
      this.router.navigateByUrl('/landing');
    } else if (action === "home") {
      this.router.navigateByUrl('/landing')
    }
  }


  onInput(value: string) {

    if (value != "" && value.length > 1) {
      console.log("onInput " + value)
      this.takeActFor('getHostDetail')
    }
  }
  getHostDetail() {
    document.getElementById("bodyloader").style.display = "block";
    let prepareData: any = "";


    prepareData = { "SearchString": this.searchText, "Searchby": this.KIOSK_PROPERTIES.COMMON_CONFIG.SearchHostBy };

    console.log(JSON.stringify(prepareData));
    this.apiServices.localPostMethod("SearchHostBy", prepareData).subscribe((data: any) => {
      console.log("SearchHostBy " + JSON.stringify(data));
      document.getElementById("bodyloader").style.display = "none";
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        debugger
        let Data = JSON.parse(data[0]["Data"]);
        if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {
          if (Data["Table1"] != undefined && Data["Table1"].length > 0) {

            let host_details = Data["Table1"][0];

            this.router.navigate(['/host-view'], { queryParams: host_details });

          }
        } else {
          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: { title: Data["Table"][0]['description'], btn_ok: "Ok" }
          });
        }
      }
    },
      err => {
        document.getElementById("bodyloader").style.display = "none";
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: 'Error', btn_ok: "Ok" }
        });
        return false;
      });
  }



  openKeyBoard(field_caption, value) {
    //this.selectedType = selectedType;
    const host = this.bottomSheet.open(KeboardBottomSheetComponent, {
      panelClass: 'keyboard-normal-bottom-sheet',
      data: {
        mode: "other",
        value: value,
        field_caption: field_caption
      }
    });
    host.afterDismissed().subscribe(result => {
      if (result != undefined) {
        console.log(result);
        setTimeout(() => {
          this.searchText = result;
        });

      }
    });
  }
}

