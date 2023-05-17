import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  title = 'DHL';
  action_caption = 'Touch to start';
  MY_CARD_DISPENSER: any = {};
  RECEIPT_RESPONSE = "";
  result = '';
  @ViewChild('input1') inputEl: ElementRef;
  @ViewChild('cardSerInput') cardSerInput: ElementRef;

  constructor(private router: Router, private apiServices: ApiServices) {
    this.MY_CARD_DISPENSER = JSON.parse(localStorage.getItem("CARD_D_STATUS")) || {};
    this._updateKioskSettings();
    document.getElementById("homeButton").style.display = "none";
    setInterval(() => {
      if (this.cardSerInput != undefined)
        this.cardSerInput.nativeElement.focus();
    }, 100);
  }
  getDeviceConnectionData(action: string) {

    let req = AppSettings['APP_SERVICES'][action];
    if (action === "SetCardIn") {
      req += "COM14";
      setTimeout(() => {
        this.inputEl.nativeElement.value = "";
        this.inputEl.nativeElement.focus();
      });
    }
    this.apiServices.getApiDeviceConnectionRequest(req).subscribe(data => {
      console.log(data);
      this.result = JSON.stringify(data);
    },
      err => {
        console.log("Failed...");
        return false;
      });
  }
  goback() {
    this.router.navigateByUrl('/landing');
  }
  ngOnInit() {
    let i = 0;
    let max = 1;
    let con = true;
    (function repeat() {
      if (++i > max) return;
      setTimeout(function () {
        console.log("waited for: " + i + " seconds");
        if (con)
          repeat();
      }, 1000);
    })();
  }
  testCardDType2(action: string) {
    let racrion = "SD_GetCardStatus";
    let _key = "cardStatus";
    if (action == "move_read_position") {
      racrion = "SD_MoveCardToReaderPosition";
      _key = "cardMovePostn";
    } else if (action == "get_card_sn") {
      racrion = "SD_GetCardSN";
      _key = "cardserial";
    } else if (action == "card_reject") {
      racrion = "SD_RejectCard";
      _key = "cardReject";
    } else if (action == "card_eject") {
      racrion = "SD_EjectCard";
      _key = "cardEject";
    }
    this.apiServices.localGetMethod(racrion, "").subscribe((data: any) => {
      if (data.length > 0 && data[0]['Data'] != "") {
        let _initCardD = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
        this.MY_CARD_DISPENSER[_key] = _initCardD;
      }
    },
      err => {
        return false;
      });
  }
  BUSINESS_CARD_DATA: string = "";
  getBusinessCardDetails() {
    this.apiServices.localGetMethod("getBusinessCardData", "").subscribe((data: any) => {
      this.BUSINESS_CARD_DATA = JSON.stringify(data);
    },
      err => {
        console.log("Failed...");
        this.BUSINESS_CARD_DATA = "Failed ... ";
        return false;
      });
  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
  testPrintReceipt() {
    var preparedJSON = {
      "psJSON": "{\"CompanyName\":\"Calms Technologies Sdn Bhd\",\"Address1\":\"Block DC3, Server Farm, UPM-MTDC Technology Centre\",\"Address2\":\"Universiti Putra Malaysia, 43400 Serdang , Selangor DE\",\"Address3\":\"\",\"CompanyMobile\":\"+603 8941 8708 \",\"SlipTitle\":\"VISITOR ENTRY SLIP\",\"SlipSubTitle_1\":\"VISITOR DETAILS\",\"SlipSubTitle_2\":\"CHECK-IN DETAILS\",\"SlipSubTitle_3\":\"HOST DETAILS\",\"VisitorName\":\"SIVAPRAKASH JEYARAJ\",\"VisitorIC\":\"123456\",\"VisitorCompany\":\"individual\",\"VisitorCategory\":\"Visitor\",\"VisitorContact\":\"0987654321\",\"VisitorVehicle\":\"WLX7256\",\"HostPurpose\":\"collect document\",\"CheckInTime\":\"22-02-2019 01:40 pm\",\"PermittedTime\":\"22-02-2019 03:40 pm\",\"PassNo\":\"12345\",\"CheckINLocation\":\"Kiosk 1\",\"CheckINBy\":\"VISITOR\",\"NoOfPersons\":\"1\",\"HostName\":\"\",\"HostCompany\":\"\",\"HostDepartment\":\"\",\"Floor\":\"\",\"PrintType\":\"OR\",\"Terms1\":\"Terms and Conditions\",\"Terms2\":\"Visitor understand, acknowledge and conf\",\"Terms3\":\"that all details provided are accurate\",\"Terms4\":\"\",\"Terms5\":\"\",\"Message1\":\"Thank You\",\"Message2\":\"\",\"PrintField\":\"\"}",
      "appSettings": {
        alowSMS: this.KIOSK_PROPERTIES['modules']['SMS']['enable'],
        SMSEndPoint: this.KIOSK_PROPERTIES['modules']['SMS']['apiURL'],
        SMSEndPointId: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointId'],
        SMSEndPointPwd: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPwd'],
        SMSEndPointPort: this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPort'],
        SMSContent: this.KIOSK_PROPERTIES['modules']['SMS']['sms_template'],
        printEnable: this.KIOSK_PROPERTIES['modules']['printer']['recipt_enable'],
        printerName: this.KIOSK_PROPERTIES['modules']['printer']['printer_receipt_name'],
      }
    }
    this.apiServices.PrintVisitorReceipt(preparedJSON)
      .subscribe((data: any) => {
        this.RECEIPT_RESPONSE = JSON.stringify(data);
        return true;
      },
        err => {
          console.log("Failed...");
          this.RECEIPT_RESPONSE = JSON.stringify("Failed...");
          return false;
        });
  }
  get_cardSerial_number_type1() {
    debugger
    let _this = this;
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    let _cardDcom = JSON.parse(setngs)["kioskSetup"].modules['card_dispenser']['COM_Port'] || "";
    this.apiServices.localGetMethod("CD_OpenPort", _cardDcom).subscribe((data: any) => {
      debugger
      console.log("CD_OpenPort data " + data);
      if (data.length > 0 && data[0]['Data'] != null) {
        debugger
        let cardStatus = JSON.parse(data[0]['Data']) || { "ResponseStatus": "1", "ResponseMessage": "Invalid JSON" };
        console.log("CD_OpenPort cardStatus " + cardStatus);
        if (cardStatus["ResponseStatus"] > 0) {
          this.apiServices.localGetMethod("CD_PreSend", "").subscribe((data: any) => {
            console.log("CD_PreSend data " + data);
            debugger
            if (data.length > 0 && data[0]['Data'] != null) {
              let cardMoveStatus = JSON.parse(data[0]['Data']);

              if (cardMoveStatus['ResponseStatus'] == "0") {
                debugger
                setTimeout(function () {
                  debugger
                  if (_this.cardSerInput.nativeElement.value != "") {
                    debugger
                    console.log("CD_ card number " + _this.cardSerInput.nativeElement.value);
                    //_callback(true, _this.cardSerInput.nativeElement.value);
                  }
                  else {
                    debugger
                    this.apiServices.localGetMethod("CD_RecycleBack", "").subscribe((data: any) => {
                      debugger
                    }, err => {
                      debugger
                    });

                  }
                }, 10000);
              } else {
                debugger
                return;
              }
            } else {
              debugger
              return;
            }
          },
            err => {
              debugger
              return false;
            });
        }
        else {
          debugger
          return;
        }
      } else {
        debugger
        return;
      }
    },
      err => {
        debugger
        return false;
      });

  }
}
