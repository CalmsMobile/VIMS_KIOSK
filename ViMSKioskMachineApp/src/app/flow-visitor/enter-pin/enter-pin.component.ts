import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef, MatDialog } from '@angular/material';
import Keyboard from "simple-keyboard";
import { ApiServices } from 'src/services/apiService';
import { SettingsService } from 'src/services/settings.service';
import { appConfirmDialog } from '../flow-visitor.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enter-pin',
  templateUrl: './enter-pin.component.html',
  styleUrls: ['./enter-pin.component.scss']
})
export class EnterPinComponent implements OnInit {

  KIOSK_PROPERTIES: any;
  KIOSK_PROPERTIES_LOCAL: any = {};
  keyboard: Keyboard;
  pin = "";
  @ViewChild("box") box: ElementRef;
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<EnterPinComponent>,
    private apiServices: ApiServices,
    private settingServices: SettingsService, private dialog: MatDialog,
    private router: Router) {
    console.log("data.pin>>>>>" + data.pin);

  }
  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      debug: true,
      inputName: "box",
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: false,
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", "+ 0 {bksp}", "{enter}"]
      },
      display: {
        '{bksp}': 'Delete',
        '{enter}': 'OK',
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme"

    });
  }

  onChange = (input: string) => {
    setTimeout(() => {
      this.box.nativeElement.value = input.toUpperCase();
      this.box.nativeElement.focus();
      this.onKey(this.box.nativeElement.value, null)
    });
    this.pin = input;
    console.log("Input changed", input);
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();

    if (button === "{enter}") {
      if (this.pin == this.data.pin) {
        this.router.navigateByUrl('/getKioskCode');
        this.bottomSheetRef.dismiss(false);
      }
      else {
        this.bottomSheetRef.dismiss(false);
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: "Invalid pin !", btn_ok: "Ok" }
        });
      }
    }
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };
  textDataBindTemp(value: string, elm: string) {
    console.log(value);
    // this.searchText = value;
  }

  onKey(value: string, event: any) {
    console.log("onKey: " + value);
    console.log(JSON.stringify(event));
    //this.searchText = value;

  }
  updateSettings() {
    document.getElementById("bodyloader").style.display = "block";
    this.settingServices._verifyKioskMachineCode((status: boolean) => {
      if (localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != "" &&
        localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != "") {
        // this.UPDATE_SETTINGS_SHOW = false;
      }
      if (status) {
        this.getIconSrc();
      } else {
        document.getElementById("bodyloader").style.display = "none";
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: "Connect to server problem ! please contact admin.", btn_ok: "Ok" }
        });
      }
    });
  }
  getIconSrc() {
    localStorage.setItem('KIOSK_RequestAppointment', '');
    localStorage.setItem('KIOSK_WalkinRegistration', '');
    localStorage.setItem('KIOSK_CheckOut', '');
    localStorage.setItem('KIOSK_MyKad', '');
    localStorage.setItem('KIOSK_IDScanner', '');
    localStorage.setItem('KIOSK_Passport', '');
    localStorage.setItem('KIOSK_BusinessCard', '');
    localStorage.setItem('KIOSK_Appointment', '');
    localStorage.setItem('KIOSK_ManualRegistration', '');
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      const logoSrcs = this.KIOSK_PROPERTIES['commonsetup']['button_background_image'];
      if (logoSrcs && logoSrcs.length > 0) {
        const apiUrl = this.apiServices._getAPIURL() + '/FS/';
        let downloadCount = 0;
        for (let i = 0; i < logoSrcs.length; i++) {
          const locaItem = logoSrcs[i];
          console.log(locaItem.Type + " --> Request Position:" + i);
          this.getBase64ImageFromUrl(apiUrl + locaItem.imgpathurl)
            .then(result => {
              downloadCount = downloadCount + 1;
              console.log(locaItem.Type + " --> Base64: completed downloadCount:" + downloadCount);
              localStorage.setItem('KIOSK_' + locaItem.Type, result + '');
              if (downloadCount === logoSrcs.length) {
                console.log("Call success ->> length:" + logoSrcs.length + " downloadCount:" + downloadCount);
                this.callBackSuccess();
              }
            })
            .catch(err => {
              console.error(err);
              downloadCount = downloadCount + 1;
              if (downloadCount === logoSrcs.length) {
                console.log("Call success ->> length:" + logoSrcs.length + " downloadCount:" + downloadCount);
                this.callBackSuccess();
              }
            });
        }
      } else {
        this.callBackSuccess();
      }
    } else {
      this.callBackSuccess();
    }

  }
  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener("load", () => {
        resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
  callBackSuccess() {
    //this._getAllHostList();
    document.getElementById("bodyloader").style.display = "none";
    console.log("Image download success");
    /* let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.data.pin = this.KIOSK_PROPERTIES['commonsetup']['password_pin'];
    } */
    this.bottomSheetRef.dismiss(true);

    this.dialog.open(appConfirmDialog, {
      width: '250px',
      data: { title: "Kiosk Properties Updated !", btn_ok: "Ok" }
    });
    //this.router.navigate(['/landing'], { queryParams: {} });
  }

}

