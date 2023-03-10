import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/services/app.settings';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {

  KIOSK_PROPERTIES: any = {};
  constructor(private router:Router) {
    this._updateKioskSettings();
  }

  ngOnInit() {
    document.getElementById("homeButton").style.display = "none";
  }
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      console.log(this.KIOSK_PROPERTIES);
    }
  }
  takeActFor(action:String){
    if(action == 'cancel' || action == 'home'){
      this.router.navigateByUrl('/landing');
    }else if(action == 'start'){
      this.router.navigateByUrl('/success');

      switch (localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE)) {
        case "visitor50":
          this.router.navigateByUrl('/detailsVisitor');
          break;
        case "contractor":
          this.router.navigateByUrl('/detailsContractor');
          break;
        case "vendor":
          this.router.navigateByUrl('/detailsVendor');
          break;
        case "contractor_staff":
          this.router.navigateByUrl('/detailsContractorStaff');
          break;

        default:
          break;
      }
    }
  }
}
