import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'src/services/app.settings';
import { ApiServices } from 'src/services/apiService';
import { MatSnackBar, MatDialog } from '@angular/material';
import { appConfirmDialog } from '../flow-visitor.component';
import { DialogPrepareForScanComponent } from '../registration-type/registration-type.component';
@Component({
  selector: 'app-scan-rloading',
  templateUrl: './scan-rloading.component.html',
  styleUrls: ['./scan-rloading.component.scss']
})
export class ScanRLoadingComponent implements OnInit {

  sub:any;
  docType:any = '';
  constructor(private router:Router,
     private route: ActivatedRoute,
     public snackBar: MatSnackBar,
     private dialog:MatDialog,
     private apiServices:ApiServices) {
    this.docType = '';
    localStorage.setItem("VISI_SCAN_DOC_DATA","");
    this._updateKioskSettings();
  }
  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.docType = params['docType'];
        if(this.docType == undefined || this.docType == ''){
          this.gotoRegistrationScreen();
        } else{
          if(this.docType == 'SING_NRICrDRIV'){
            this.getDeviceConnectionData('getIdScanerData');
          } else if(this.docType == 'PASSPORT'){
            this.getDeviceConnectionData('GetPassportDetail');
          } else if(this.docType == 'MYCARD'){
            this.getMyCardDetails('MYCARD');
          } else if(this.docType == 'BUSINESS'){
            this.getBusinessCardDetails('BUSINESS');
          }
        }
      });
  }

  gotoRegistrationScreen() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
    if ((this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC || !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license) &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing');
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing');
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing');
        } else if (!this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Driving_license &&
          this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_visitor &&
          !this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_manual) {
            this.router.navigateByUrl('/landing');
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
  }
  ngOnDestroy() {
    this.apiServices.localGetMethod("setLEDOFF","").subscribe((ledStatus:any) => {},err=>{});
  }
  getDeviceConnectionData(action:string){
    let req = AppSettings['APP_SERVICES'][action];
    this.apiServices.getApiDeviceConnectionRequest(req).subscribe((data: any) => {
      if((action == "GetPassportDetail" || action == "getIdScanerData" ) && data.length > 0 ) {
        if(data[0].Status){
          let resData = JSON.parse(data[0]["Data"]) || {};
          if(resData['PassportNo'] != "" && resData['FullNameName'] != ""){
            let userData = {
              "visName":resData['FullNameName'],
              "visDOCID":resData['PassportNo'],
              "visDocImage":(typeof(resData['Image'])!='undefined'?"data:image/jpeg;base64," +resData['Image']:""),//resData['Image'] || resData['IDImgByte'],
            }
            localStorage.setItem("VISI_SCAN_DOC_DATA",JSON.stringify(userData));
            this.router.navigate(['/visitorAppointmentDetail'], {queryParams: { docType: this.docType }});
          } else{
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg();
            this.gotoRegistrationScreen();
          }
        }else{
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg();
          this.gotoRegistrationScreen();
        }
      } else{
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg();
        this.gotoRegistrationScreen();
      }
    },
    err => {
      console.log("Failed...");
      this.showErrorMsg();
      return false;
    });
    //{"PassportNo":"S8076606H","FullNameName":"ZHANG JINMING","State":"","City":"","Address":"","Country":"CHINESE","DocType":"3362","Gender":"Male","PostCode":"","IDImgByte":"R0
  }
  getMyCardDetails(action:string){
    // let req = AppSettings['APP_SERVICES'][action];
    this.apiServices.localGetMethod("GetMyKadDetails","").subscribe((data:any) => {
      console.log(data);
      if((action == "MYCARD") && data.length > 0 ) {
        if(data[0].Status){
          let resData = JSON.parse(data[0]["Data"]) || [];
          if(resData.length > 0 && resData[0] === "1"){
            let userData = {
              "visName":resData[2],
              "visDOCID":resData[1],
              "visDocImage":(typeof(resData[16])!='undefined'?"data:image/jpeg;base64," +resData[16]:""),
            }
            localStorage.setItem("VISI_SCAN_DOC_DATA",JSON.stringify(userData));
            this.router.navigate(['/visitorAppointmentDetail'], {queryParams: { docType: this.docType }});
          } else{
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg();
            this.gotoRegistrationScreen();
          }
        }else{
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg();
          this.gotoRegistrationScreen();
        }
      } else{
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg();
        this.gotoRegistrationScreen();
      }
    },
    err => {
      console.log("Failed...");
      this.showErrorMsg();
      return false;
    });
  }
  getBusinessCardDetails(action:string){
    // let req = AppSettings['APP_SERVICES'][action];
    this.apiServices.localGetMethod("getBusinessCardData","").subscribe((data:any) => {
      console.log(data);
      if((action == "BUSINESS") && data.length > 0 ) {
        if(data[0].Status){
          let resData = JSON.parse(data[0]["Data"]) || {};
          if(resData['ResponseStatus'] == "0"){
            let userData = {
              "FullName": resData["FullName"] || "",
              "CompanyName": resData["CompanyName"] || "",
              "MobileContact": resData["MobileContact"] || "",
              "Email": resData["Email"] || "",
              "Position": resData["Position"] || "",
              "OfficeContact": resData["OfficeContact"] || "",
              "Website": resData["Website"] || "",
              "Address": resData["Address"] || "",
              "CardImagePath": resData["CardImagePath"] || "",
            }
            localStorage.setItem("VISI_SCAN_DOC_DATA",JSON.stringify(userData));
            this.router.navigate(['/visitorAppointmentDetail'], {queryParams: { docType: this.docType }});
          } else{
            //this.snackBar.open("Device connection failed ! Please Try Again !", "", {duration: 3000});
            this.showErrorMsg();
            this.gotoRegistrationScreen();
          }
        }else{
          //this.snackBar.open("Please Try Again !", "", {duration: 3000});
          this.showErrorMsg();
          this.gotoRegistrationScreen();
        }
      } else{
        //this.snackBar.open("Please Try Again !", "", {duration: 3000});
        this.showErrorMsg();
        this.gotoRegistrationScreen();
      }
    },
    err => {
      console.log("Failed...");
      this.showErrorMsg();
      return false;
    });
  }
  takeActFor(action:string){
    if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }
  showErrorMsg(){
    let documentTypes = {
      "MYCARD": this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRIC_label,
      "SING_NRICrDRIV" : this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_NRICRLicenselabel,
      "PASSPORT":this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Passport_label,
      "BUSINESS":this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_Busins_Card_label,
      "PREAPPOINTMT":this.KIOSK_PROPERTIES.modules.only_visitor.checkin.in_prereg_option.in_prereg_label
    }
    let target_text = this.KIOSK_PROPERTIES['commonsetup']['Scan_failed_msg'];
    target_text = target_text.replace(new RegExp("{{document}}", 'g'), documentTypes[this.docType]);
    let dialogRef = this.dialog.open(appConfirmDialog, {
      width: '250px',
      data: {title: target_text, btn_ok:"Ok", document:documentTypes[this.docType]}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.gotoRegistrationScreen();
    });
  }
}
