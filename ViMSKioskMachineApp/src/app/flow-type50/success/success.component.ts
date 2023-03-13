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
    } else if (action == 'addWorker') {
      //this.router.navigateByUrl('/details');
      this.router.navigateByUrl('/terms');
    } else if (action === 'home') {
      this.router.navigateByUrl('/landing');
    } else if (action === 'addWorker') {
      let userData = {
        "visName": "",
        "visDOCID": "",
        "visDocImage": null,
      }
      localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(userData));
      this.router.navigateByUrl('/details')
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
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be issued";
          break;
        case 'Contractor':
          this.RESULT_MSG = "Contractor Successfully Checked In!";
          this.RESULT_MSG2 = "proceed to FM Office to obtain Permit to Work<br>and bring the form to Security counter and place it in the box.<br>Please proceed to gantry and scan the pass for entry";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be issued";
          break;
        case 'Vendor':
          this.RESULT_MSG = "Vendor Successfully Checked In";
          this.RESULT_MSG2 = "Please collect your pass from the dispenser,<br>and then proceed to gantry to scan the pass for entry";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be issued"
          break;
        case 'Contractor Staff':
          this.RESULT_MSG = "Contract Staff Successfully Checked In";
          this.RESULT_MSG2 = "Please collect the access card from the Security Counter";
          this.RESULT_MSG3 = "Do not bring the pass out of the hospital. Pass should<br>be returned upon leaving, drop into the gantry when scanning out<br>*if found liable for missing pass, a $20 fine will be issued"
          break;

        default:
          this.RESULT_MSG = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['in_sccess_msg1'];
          this.RESULT_MSG2 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_message_mid'];
          this.RESULT_MSG3 = this.KIOSK_PROPERTIES['modules']['only_visitor']['checkin']['success_message_last'];
          break;
      }

    }
  }
  private chk_hardwares_to_finish(att_id: string, _visitorData: any, _nextElemcallBack: any) {
    debugger
    console.log(JSON.stringify(_visitorData));
    let _Modules = this.KIOSK_PROPERTIES['modules'];
    let IsCardDispenserNotAllowedCateg = (AppSettings.APP_DEFAULT_SETTIGS.Disable_CardDispenser ? (AppSettings.APP_DEFAULT_SETTIGS.Disable_CardDispenser).split(',') : []);
    const IsCardDispenserNotAllowed = (IsCardDispenserNotAllowedCateg.indexOf(_visitorData.Category) > -1 ? true : false);
    //this.cardDispenserNotAllowed = IsCardDispenserNotAllowed;

    let _get_cardSerial_number_type1 = (_callback: any) => {
      debugger
      let _this = this;
      let setngs = localStorage.getItem('KIOSK_PROPERTIES');
      let _cardDcom = JSON.parse(setngs)["kioskSetup"].modules['card_dispenser']['COM_Port'] || "";
      this.apiServices.localGetMethod("CD_OpenPort", _cardDcom).subscribe((data: any) => {
        debugger
        if (data.length > 0 && data[0]['Data'] != "") {
          let cardStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
          if (cardStatus['ResponseStatus'] > 0) {
            if (cardStatus["ResponseStatus"] > 0) {
              this.apiServices.localGetMethod("CD_PreSend", "").subscribe((data: any) => {
                debugger
                if (data.length > 0 && data[0]['Data'] != "") {
                  let cardMoveStatus = JSON.parse(data[0]['Data']);
                  if (cardMoveStatus['ResponseStatus'] == "0") {
                    setTimeout(function () {
                      _callback(true, _this.cardSerInput.nativeElement.value);
                    }, 5000);
                  } else {
                    _callback(false, "0");
                    return;
                  }
                } else {
                  _callback(false, "0");
                  return;
                }
              },
                err => {
                  _callback(false, "0");
                  return false;
                });
            }
            else {
              _callback(false, "0");
              return;
            }
          } else {
            _callback(false, "0");
            return;
          }
        } else {
          _callback(false, "0");
          return;
        }
      },
        err => {
          debugger
          _callback(false, "0");
          return false;
        });

    }
    if (_Modules['card_dispenser']['enable']) {
      debugger
      if (_Modules['card_dispenser']['dispenser_type'] == 'TYPE1') {
        _get_cardSerial_number_type1((status: boolean, serial: string) => {
          debugger
          if (status) {
              debugger
              if (status['s'] === true) {
                this.apiServices.localGetMethod("CD_DispenseCard", "").subscribe((data: any) => {
                  if (data.length > 0 && data[0]['Data'] != "") {
                    let cardEjectStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
                    if (cardEjectStatus['ResponseStatus'] == "0") {

                    } else {
                    }
                  } else {
                  }
                },
                  err => {
                  });
              }

          } else {
            this.apiServices.localGetMethod("CD_RecycleBack", "").subscribe((data: any) => { }, err => { });
            const dialogRef = this.dialog.open(DialogSuccessMessagePage, {
              data: { "title": "Please Contact reception !", "subTile": "Visitor checkin : Problem in card dispenser !", "ok": "Ok" },
              disableClose: true
            });
            dialogRef.afterClosed().subscribe((data) => {
              this.router.navigate(['/landing']);
            });
          }
        });


      }
    }

  }
}
