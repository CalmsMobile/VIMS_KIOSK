import { Component, OnInit } from '@angular/core';
import { AppSettings } from 'src/services/app.settings';



@Component({
  selector: 'app-ui-settings',
  templateUrl: './ui-settings.component.html',
  styleUrls: ['./ui-settings.component.scss']
})
export class UiSettingsComponent implements OnInit {
  KIOSK_PROPERTIES: any = {};
  KIOSK_TYPE:string = AppSettings.KIOSK_TYPE_LANDSCAPE;
  constructor() {
    this._updateKioskSettings();
  }
  _updateKioskSettings() {
    let kioskType = localStorage.getItem('KIOSK_TYPE');
    if (kioskType != undefined) {
      this.KIOSK_TYPE = kioskType;
    }else{
      this.changeOrientation(AppSettings.KIOSK_TYPE_LANDSCAPE);
    }
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      //this.KIOSK_AVAL_CARDS = this.KIOSK_PROPERTIES['kioskAvalCards'];
    }
  }

  ngOnInit() {

  }
  changeOrientation(type) {
    localStorage.setItem('KIOSK_TYPE', type);
    this.KIOSK_TYPE = localStorage.getItem('KIOSK_TYPE');
  }
}
