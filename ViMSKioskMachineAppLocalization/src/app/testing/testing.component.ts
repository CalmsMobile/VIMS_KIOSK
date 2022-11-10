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
  MY_CARD_DISPENSER:any = {}; 
  RECEIPT_RESPONSE = "";
  result = '';
  @ViewChild('input1') inputEl:ElementRef;

  constructor(private router:Router,private apiServices:ApiServices){
    this.MY_CARD_DISPENSER =  JSON.parse(localStorage.getItem("CARD_D_STATUS")) || {};
    this._updateKioskSettings();
    document.getElementById("homeButton").style.display = "none";
  }
  getDeviceConnectionData(action:string){

    let req = AppSettings['APP_SERVICES'][action];
    if(action === "SetCardIn"){
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
  goback(){
    this.router.navigateByUrl('/landing');
  }
  ngOnInit() {
  }
  testCardDType2(action:string){
    let racrion = "SD_GetCardStatus";
    let _key = "cardStatus";
    if(action == "move_read_position"){
      racrion = "SD_MoveCardToReaderPosition";
      _key = "cardMovePostn";
    } else if(action == "get_card_sn"){
      racrion = "SD_GetCardSN";
      _key = "cardserial";
    } else if(action == "card_reject"){
      racrion = "SD_RejectCard";
      _key = "cardReject";
    } else if(action == "card_eject"){
      racrion = "SD_EjectCard";
      _key = "cardEject";
    }
    this.apiServices.localGetMethod(racrion,"").subscribe((data:any) => {
      if(data.length > 0 && data[0]['Data'] != ""){
        let _initCardD = JSON.parse(data[0]['Data']) || {"ResponseStatus":"1","ResponseMessage":"Invalid JSON"};
        this.MY_CARD_DISPENSER[_key] = _initCardD;
      }
    },
    err => {
      return false;
    });
  }
  BUSINESS_CARD_DATA:string = ""; 
  getBusinessCardDetails(){
    this.apiServices.localGetMethod("getBusinessCardData","").subscribe((data:any) => {
      this.BUSINESS_CARD_DATA = JSON.stringify(data);
    },
    err => { 
      console.log("Failed...");
      this.BUSINESS_CARD_DATA = "Failed ... ";
      return false;
    });
  }
  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES'); 
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
  testPrintReceipt(){
    var preparedJSON = {
      "psJSON":"{\"CompanyName\":\"Calms Technologies Sdn Bhd\",\"Address1\":\"Block DC3, Server Farm, UPM-MTDC Technology Centre\",\"Address2\":\"Universiti Putra Malaysia, 43400 Serdang , Selangor DE\",\"Address3\":\"\",\"CompanyMobile\":\"+603 8941 8708 \",\"SlipTitle\":\"VISITOR ENTRY SLIP\",\"SlipSubTitle_1\":\"VISITOR DETAILS\",\"SlipSubTitle_2\":\"CHECK-IN DETAILS\",\"SlipSubTitle_3\":\"HOST DETAILS\",\"VisitorName\":\"SIVAPRAKASH JEYARAJ\",\"VisitorIC\":\"123456\",\"VisitorCompany\":\"individual\",\"VisitorCategory\":\"Visitor\",\"VisitorContact\":\"0987654321\",\"VisitorVehicle\":\"WLX7256\",\"HostPurpose\":\"collect document\",\"CheckInTime\":\"22-02-2019 01:40 pm\",\"PermittedTime\":\"22-02-2019 03:40 pm\",\"PassNo\":\"12345\",\"CheckINLocation\":\"Kiosk 1\",\"CheckINBy\":\"VISITOR\",\"NoOfPersons\":\"1\",\"HostName\":\"\",\"HostCompany\":\"\",\"HostDepartment\":\"\",\"Floor\":\"\",\"PrintType\":\"OR\",\"Terms1\":\"Terms and Conditions\",\"Terms2\":\"Visitor understand, acknowledge and conf\",\"Terms3\":\"that all details provided are accurate\",\"Terms4\":\"\",\"Terms5\":\"\",\"Message1\":\"Thank You\",\"Message2\":\"\",\"PrintField\":\"\"}",
      "appSettings":{
        alowSMS:this.KIOSK_PROPERTIES['modules']['SMS']['enable'],
        SMSEndPoint:this.KIOSK_PROPERTIES['modules']['SMS']['apiURL'],
        SMSEndPointId:this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointId'],
        SMSEndPointPwd:this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPwd'],
        SMSEndPointPort:this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPort'],
        SMSContent:this.KIOSK_PROPERTIES['modules']['SMS']['sms_template'],
        printEnable:this.KIOSK_PROPERTIES['modules']['printer']['recipt_enable'],
        printerName:this.KIOSK_PROPERTIES['modules']['printer']['printer_receipt_name'],
      }
    }
    this.apiServices.PrintVisitorReceipt(preparedJSON)
      .subscribe((data:any) => {
        this.RECEIPT_RESPONSE = JSON.stringify(data);
        return true;
      },
      err => { 
        console.log("Failed...");
        this.RECEIPT_RESPONSE = JSON.stringify("Failed...");
        return false;
      });
  }
}
