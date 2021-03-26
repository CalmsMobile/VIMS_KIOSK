import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { SettingsService} from '../../../services/settings.service';
import { appConfirmDialog } from '../flow-visitor.component';
import { DialogPrepareForScanComponent } from '../registration-type/registration-type.component';

@Component({
  selector: 'app-visitor-pre-apontmnt',
  templateUrl: './visitor-pre-apontmnt.component.html',
  styleUrls: ['./visitor-pre-apontmnt.component.scss']
})
export class VisitorPreApontmntComponent implements OnInit {
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
      if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license) &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing')
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing')
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing')
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing')
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing');
        } else {
          this.router.navigateByUrl('/visitorRegisType');
        }
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
    let prepareData = {"att_appointment_id": (this.APONTMNT_CODE).toString()};
    this.apiServices.localPostMethod("getAptmentInformation",prepareData ).subscribe((data:any) => {
      console.log(data);
      document.getElementById("bodyloader").style.display = "none";
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        let Data = data[0]["Data"];
        if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10){
          if(Data["Table1"]!= undefined && Data["Table1"].length > 0){
            let _app_details = Data["Table1"][0];
            _app_details['aptid'] =  (this.APONTMNT_CODE).toString();
            localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(_app_details));
            this.router.navigate(['/visitorAppointmentDetail'], {queryParams: { docType: "PREAPPOINTMT" }});
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
        data: {title: "Invalid Appointment ID", btn_ok:"Ok"}
      });
      return false;
    });
  }
}
