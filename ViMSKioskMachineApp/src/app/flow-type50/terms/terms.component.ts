import { Router } from '@angular/router';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  KIOSK_PROPERTIES: any = {};
  constructor(private router:Router) {
    this._updateKioskSettings()
  }

  ngOnInit() {
    document.getElementById("homeButton").style.display = "none";
  }
  ngAfterViewInit() {

  }

  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      console.log(this.KIOSK_PROPERTIES);
    }
  }
  takeActFor(action: String) {
    if(action === 'scan')
    this.router.navigateByUrl('/scan');
    if(action === 'home')
    this.router.navigateByUrl('/landing');
  }
}
