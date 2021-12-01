import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { SettingsService} from '../../../services/settings.service';
import { appConfirmDialog } from '../flow-visitor.component';
import { DialogPrepareForScanComponent } from '../registration-type/registration-type.component';

@Component({
  selector: 'app-visitor-checkout',
  templateUrl: './visitor-checkout.component.html',
  styleUrls: ['./visitor-checkout.component.scss']
})
export class VisitorCheckoutComponent implements OnInit {
  scanData:any = '';
  totalVisitors:number = 0;
  APONTMNT_CODE:any;
  constructor(private router:Router,
    private route: ActivatedRoute,
    private settingService: SettingsService,
    private dialog:MatDialog,
    private apiServices:ApiServices) {
      let listOFvisitors:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
      this.totalVisitors = listOFvisitors['visitorDetails'].length;
      this._updateKioskSettings();
      this.APONTMNT_CODE = '';
     }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.scanData = params['scanData'];
        if(this.scanData != undefined && this.scanData != ''){
          this._goAndGetAppointmentDetails();
        }
      });
  }
  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
  takeActFor(action:string){
    if(action === "getAppointmentDetail"){
      if((this.APONTMNT_CODE).toString().length > 0){
        this.getAppointmentDetails();
      }
    } else if(action === "back"){
      this.router.navigateByUrl('/landing')
    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    } else if(action =="scanNow"){
      this.router.navigate(['/scanQRCode'], {queryParams: { scanType: 'PREAPPOINTMT' }});
    }
  }
  _goAndGetAppointmentDetails(){
    // {"aptid":"19","aptgid":"20190204110305","cid":"1"}
    try{
      //let _scanData:any = this.settingService._decrypt(this.scanData);
      // _scanData = (_scanData != "") ? JSON.parse(_scanData) : {};
      //console.log(_scanData);
      // this.APONTMNT_CODE = _scanData['aptid'] || '';
       this.APONTMNT_CODE = this.scanData;
       this.takeActFor('getAppointmentDetail');
    } catch(ex){
      console.log("Invalid Code");
    }
  }
  textDataBindTemp(value : string, elm:string ) {
    console.log(value);
    this.APONTMNT_CODE = value;
  }
  getAppointmentDetails(){
    document.getElementById("bodyloader").style.display = "block";
    let prepareData = {"hexcode": (this.APONTMNT_CODE).toString()};
    this.apiServices.localPostMethod("VimsAppGetAppointmentByAttHexCode",prepareData ).subscribe((data:any) => {
      console.log(data);
      document.getElementById("bodyloader").style.display = "none";
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        let Data = JSON.parse(data[0]["Data"]);
        if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10){
          if(Data["Table1"]!= undefined && Data["Table1"].length > 0){
            let _app_details = Data["Table1"][0];
            this.router.navigate(['/checkoutSuccess'], {queryParams: { data: JSON.stringify(_app_details) }});
          }else{
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: {title: "Invalid Appointment ID", btn_ok:"Ok"}
            });
          }
        }else if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] > 10){
          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: {title: Data["Table"][0]['description'] ? Data["Table"][0]['description']: "Invalid Appointment ID", btn_ok:"Ok"}
          });
        }else{
          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: {title: "Invalid Appointment ID", btn_ok:"Ok"}
          });
        }
      }else{
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: {title: "Invalid Appointment ID", btn_ok:"Ok"}
        });
      }
    },
    err => {
      document.getElementById("bodyloader").style.display = "none";
      this.dialog.open(appConfirmDialog, {
        width: '250px',
        data: {title: err && err.message ? err.message : "Invalid Appointment ID", btn_ok:"Ok"}
      });
      return false;
    });
  }
}
