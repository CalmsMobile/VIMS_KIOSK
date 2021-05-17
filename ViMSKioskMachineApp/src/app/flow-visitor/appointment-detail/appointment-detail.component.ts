import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatBottomSheet, MatBottomSheetRef, MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { ApiServices } from 'src/services/apiService';

import {Observable, Subject} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { AppointmentModal } from './appointmentModal';
import { AppSettings } from 'src/services/app.settings';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';
@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent implements OnInit {
  aptmDetails:AppointmentModal;
  isDisablePurpose = false;
  docType:any = '';
  mainModule = '';
  totalVisitors:number = 0;
  temp_take_pic = 'assets/images/cus_icons/take_picture.png';
  QuestionsDisplay = [];
  videoPath = '';
  DefaultAddVisitorSettings=JSON.stringify({"AddVisitorsSeqId":0,"NameEnabled":false,"NameRequired":false,"IdProofEnabled":false,"IdProofRequired":false,"EmailEnabled":false,"EmailRequired":false,"CompanyEnabled":false,"CompanyRequired":false,"CategoryEnabled":true,"CategoryRequired":true,"ContactNumberEnabled":false,"ContactNumberRequired":false,"VehicleNumberEnabled":false,"VehicleNumberRequired":false,"GenderEnabled":false,"GenderRequired":false,"ImageUploadEnabled":false,"WorkPermit":false,"WorkPermitRequired":false,"WorkPermitExpiry":false,"WorkPermitExpiryRequired":false,"CountryEnabled":false,"CountryRequired":false,"AddressEnabled":false,"AddressRequired":false,"HostNameEnabled":false,"HostNameRequired":false,"HostDepartmentEnabled":false,"HostDepartmentRequired":false,"AttachmentUploadEnabled":false,"AttachmentUploadRequired":false,"MaxAttachmentAllowed":0,"VisitorCategories":"0","PurposeEnabled":false,"PurposeRequired":false});
  constructor(private router:Router,
     private bottomSheet: MatBottomSheet,
     private route: ActivatedRoute,
     private dialog:MatDialog,
     private apiServices:ApiServices) {

    this.aptmDetails = new AppointmentModal();
  }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
        this.docType = params['docType'];
        if(this.docType == undefined || this.docType == ''){
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
        } else {
          const resumeData = params['resumeData'];
          if (resumeData) {
            const visitorData = params['visitorData'];
            if (visitorData) {
              this.aptmDetails = JSON.parse(visitorData);
              this.NUMBER_OF_INPUTS = 0;
              this._updateKioskSettings();
              if (this.NUMBER_OF_INPUTS > 7) {
                this.showFirstPageFields = false;
              }
              this.videoPath = params['video'];
              const quest = params['questions'];
              if (quest) {
                this.QuestionsDisplay = JSON.parse(quest);
              }
            }
          }
        }
      });

      this._initUpdateScanDataValues();
      if (!this.NUMBER_OF_INPUTS || this.NUMBER_OF_INPUTS === 0) {
        this._updateKioskSettings();
        if (!this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Mandatory) {
          this.aptmDetails.purpose = this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.default;
        }
      }
      this._updateVisitorCheckINSettings();
      this._getAllPurposeOfVisit();
  }
  _initUpdateScanDataValues(){
    if((this.docType == "PASSPORT" || this.docType == "SING_NRICrDRIV" || this.docType == "MYCARD")
    && localStorage.getItem("VISI_SCAN_DOC_DATA") != undefined
    && localStorage.getItem("VISI_SCAN_DOC_DATA") != ""){
      let doc_detail = JSON.parse(localStorage.getItem("VISI_SCAN_DOC_DATA"));
      this.aptmDetails.name = doc_detail["visName"];
      this.aptmDetails.id = doc_detail["visDOCID"];
      this.aptmDetails.visitorDocB64Image = doc_detail["visDocImage"];
      this.aptmDetails.visitorB64Image = doc_detail["visDocImage"];
      this.getVisitorDetails(this.aptmDetails.id);
      //localStorage.setItem("VISI_SCAN_DOC_DATA","");

    } else if(this.docType == "PREAPPOINTMT" && localStorage.getItem("VISI_SCAN_DOC_DATA") != undefined
    && localStorage.getItem("VISI_SCAN_DOC_DATA") != ""){
      let doc_detail = JSON.parse(localStorage.getItem("VISI_SCAN_DOC_DATA"));
      this.aptmDetails.name = doc_detail["name"];
      this.aptmDetails.id = doc_detail["id"];
      this.aptmDetails.company = doc_detail["company"] || "";
      this.aptmDetails.category = doc_detail["category"] || "";
      this.aptmDetails.contact = doc_detail["contact"] || "";
      this.aptmDetails.email = doc_detail["email"] || "";
      this.aptmDetails.purpose = doc_detail["purpose"] || "";
      this.aptmDetails.vehicle = doc_detail["vehicle"] || "";
      this.aptmDetails.visitorB64Image = (doc_detail["visitorB64Image"].toString().trim() != "") ?
      ("data:image/jpeg;base64," + doc_detail["visitorB64Image"]) : "" ;
      this.aptmDetails.vbookingseqid = doc_detail['aptid'];

      this.aptmDetails.hostDetails.name = doc_detail["host_name"];
      this.aptmDetails.hostDetails.id = doc_detail["host_id"];
      this.aptmDetails.hostDetails.email = doc_detail["hots_email"];
      this.aptmDetails.hostDetails.contact = doc_detail["host_contact"];
      this.aptmDetails.hostDetails.company = doc_detail["host_company_id"];
      //localStorage.setItem("VISI_SCAN_DOC_DATA","");
      if (this.aptmDetails.purpose) {
        this.isDisablePurpose = true;
      }

    } else if((this.docType == "BUSINESS") && localStorage.getItem("VISI_SCAN_DOC_DATA") != undefined
    && localStorage.getItem("VISI_SCAN_DOC_DATA") != ""){
      let doc_detail = JSON.parse(localStorage.getItem("VISI_SCAN_DOC_DATA"));
      this.aptmDetails.name = doc_detail["FullName"] || "";
      //this.aptmDetails.id = doc_detail["id"] || "";
      this.aptmDetails.company = doc_detail["CompanyName"] || "";
      //this.aptmDetails.category = doc_detail["category"] || "";
      this.aptmDetails.contact = doc_detail["MobileContact"] || "";
      this.aptmDetails.email = doc_detail["Email"] || "";
      //this.aptmDetails.purpose = doc_detail["purpose"] || "";
      //this.aptmDetails.vehicle = doc_detail["vehicle"] || "";
      //localStorage.setItem("VISI_SCAN_DOC_DATA","");

    }
    let listOFvisitors:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    this.totalVisitors = listOFvisitors['visitorDetails'].length;

    if(this.totalVisitors > 0){ // Only For Multi visitor --- update first visitor purpose
      this.aptmDetails.purpose = listOFvisitors['visitorDetails'][0]['purpose'];
    }
  }
  takeActFor(action:string){
    if(action === "back"){
      if (!this.showFirstPageFields){
        this.showFirstPageFields = true;
        return;
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
    } else if(action === "addVisitor"){
      if(this._updateVisitorList()){
        let Questionnaries = false;
        if (this.mainModule === 'vcheckin') {
          Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_Questionnaries'];
        } else {
          Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_ques_Preappointments'];
        }
        if (Questionnaries || this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief) {
          this.router.navigate(['/questionarie'] , {queryParams:{docType: this.docType, video: this.videoPath, questions: JSON.stringify(this.QuestionsDisplay)}});
          return;
        }
        this.router.navigate(['/visitorAgree'],{queryParams:{needHostNumber:"no"}});
      } else{
        const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
          //width: '50vw',
          data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
        });
      }
    } else if(action === "confirm"){

      if (this.aptmDetails.visitor_blacklist === 'true' || this.aptmDetails.visitor_blacklist === true || this.aptmDetails.visitor_blacklist === 1 || this.aptmDetails.visitor_blacklist === '1') {
        const dialogRef = this.dialog.open(DialogAppCommonDialog, {
          //width: '250px',
          data: {"title": "Notification", "subTile":"You are not authorize to enter.Please contact host or receiptionist.",
          "enbCancel":false,"oktext":"Ok","canceltext":"Cancel"}
        });
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigateByUrl('/landing');
        });
        return;
      }
      if (this.showFirstPageFields && this.NUMBER_OF_INPUTS > 7) {
        this.showFirstPageFields = false;
        return;
      }
      if (this.KIOSK_PROPERTIES.modules.only_visitor.checkin.enb_webCam_img_capture) {
        this.takeVistorProfilePicture(action);
      } else {
        this.aptmDetails.visitorB64Image = '';
        this.confirmAfterTakePhoto();
      }

      // if(this._updateVisitorList()){
      //   this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
      // } else{
      //   const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
      //     //width: '50vw',
      //     data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
      //   });
      // }

    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    } else if(action === "visitorSummary"){
      this.router.navigateByUrl('/visitorSummaryDetail')
    }
  }
  _validateDOCIdinList(visitorID:any){
    let uploadArray:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    let listOfVisitors:any = uploadArray['visitorDetails'];
    let _flag = false;
    for(let m = 0; m < listOfVisitors.length; m++){
      if(listOfVisitors[m]['id'] == visitorID){
        _flag = true;
      }
    }
    return _flag;
  }

  takeVistorProfilePicture(action1){
    const dialogRef = this.dialog.open(takeVisitorPictureDialog, {
      disableClose: true,
      data: { action: action1}
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if(result.status){
        //console.log(result.data);
        this.aptmDetails.visitorB64Image = result.data;
        if (action1 === "addVisitor") {
          // this.addVisitorAfterTakePhoto();
        } else if (action1 === "confirm") {
          this.confirmAfterTakePhoto();
        }
      } else{
      }
    });
  }

  confirmAfterTakePhoto() {
    if(this._updateVisitorList()){
      let Questionnaries = false;
      if (this.mainModule === 'vcheckin') {
        Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_Questionnaries'];
      } else {
        Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_ques_Preappointments'];
      }
      if (Questionnaries || this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief) {
        this.router.navigate(['/questionarie'] , {queryParams:{docType: this.docType, video: this.videoPath, questions: JSON.stringify(this.QuestionsDisplay)}});
        return;
      }

      this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
    } else{
      const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
        //width: '50vw',
        data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
      });
    }
  }

  _updateVisitorList(){
    let uploadArray:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    if(!this._validateDOCIdinList(this.aptmDetails.id)){
      let listOfVisitors:any = uploadArray['visitorDetails'];
      this.aptmDetails.checkinCounter = this.KIOSK_CHECKIN_COUNTER_NAME;
      this.aptmDetails['VisitorAnswers'] = JSON.stringify([]);
      listOfVisitors.push(this.aptmDetails);
      uploadArray['visitorDetails'] = listOfVisitors;
      localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));
      return true;
    } else{
      return false;
    }
  }
  _updateVisitorCheckINSettings(){
    let uploadArray:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY") || "{}");
    uploadArray['appSettings'] = {
      alowSMS:this.KIOSK_PROPERTIES['modules']['SMS']['enable'],
      SMSEndPoint:this.KIOSK_PROPERTIES['modules']['SMS']['apiURL'],
      SMSEndPointId:this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointId'],
      SMSEndPointPwd:this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPwd'],
      SMSEndPointPort:this.KIOSK_PROPERTIES['modules']['SMS']['SMSEndPointPort'],
      SMSContent:this.KIOSK_PROPERTIES['modules']['SMS']['sms_template'],
      printEnable:this.KIOSK_PROPERTIES['modules']['printer']['enable'],
      printerName:this.KIOSK_PROPERTIES['modules']['printer']['printer_name'],
    }
    localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));

    if(!this.KIOSK_PROPERTIES['CheckinSettings']['Purpose']['Show']){
      this.aptmDetails.purpose = this.KIOSK_PROPERTIES['CheckinSettings']['Purpose']['default'];
    }
    if(!this.KIOSK_PROPERTIES['CheckinSettings']['Host']['Show']){
      this.aptmDetails.hostDetails.name = this.KIOSK_PROPERTIES['CheckinSettings']['Host']['default'];
      this.aptmDetails.hostDetails.id = "0";
    }
  }
  openBottomPurposeSheet(): void {
    if (!this.isDisablePurpose) {
      const purpose = this.bottomSheet.open(BottomSheetPurposeSheet);
      purpose.afterDismissed().subscribe(result => {
        if(result != undefined){
          this.aptmDetails.purpose = result['visitpurpose_desc'];
          this.aptmDetails.purposeId = result['visitpurpose_id'];
        }
      });
    }

  }
  openBottomCategorySelect(): void {
    const category = this.bottomSheet.open(BottomSheetCategorySelect);
    category.afterDismissed().subscribe(result => {
      if(result != undefined){
        this.aptmDetails.category = result['visitor_ctg_desc'];
        this.aptmDetails.categoryId = result['visitor_ctg_id'];
        //this.VisitorCategoryChange(result['visitor_ctg_id'],result['visitor_ctg_desc']);
        let Questionnaries = false;
        if (this.mainModule === 'vcheckin') {
          Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_Questionnaries'];
        } else {
          Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_ques_Preappointments'];
        }
        if (this.aptmDetails.categoryId && (Questionnaries || this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief)) {
          this.getQuestionsOrVideo();
        }
      }
    });
  }

  getQuestionsOrVideo() {
    const postdata = {
      "VisitorCategory": this.aptmDetails.categoryId
      }
    this.apiServices.localPostMethod('GetQuestionaries' , postdata).subscribe((data: any)=>{
      try {
        let api = this.apiServices._getAPIURL();
        if (api.split('api').length > 1) {
          api = api.split('api')[0];
        }
        const resultData = JSON.parse(data[0].Data);
        if (resultData.Table1.length > 0 && resultData.Table1[0].VideoUrl) {
          this.videoPath = api + '/FS/' + resultData.Table1[0].VideoUrl;
        }

      } catch (error) {

      }
      let Questionnaries = false;
      if (this.mainModule === 'vcheckin') {
        Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_Questionnaries'];
      } else {
        Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_ques_Preappointments'];
      }
      if (Questionnaries) {
        this.QuestionsDisplay= JSON.parse(data[0].Data).Table;
        console.log("QuestionsDisplay",data);
      }

    });
  }
  openBottomCountrySelect(): void {
    const country = this.bottomSheet.open(BottomSheetCountrySelect);
    country.afterDismissed().subscribe(result => {
      if(result != undefined){
        this.aptmDetails.country = result['name'];
        this.aptmDetails.countryId = result['code'];
      }
    });
  }

  openBottomHoursSelect(): void {
    const country = this.bottomSheet.open(BottomSheetHoursSelect);
    country.afterDismissed().subscribe(result => {
      if(result != undefined){
        this.aptmDetails.meetingHours = result['name'];
        this.aptmDetails.meetingHoursValue = result['code'];
      }
    });
  }

  openBottomGenderSelect(): void {
    const country = this.bottomSheet.open(BottomSheetGenderSelect);
    country.afterDismissed().subscribe(result => {
      if(result != undefined){
        this.aptmDetails.gender = result['name'];
        this.aptmDetails.genderId = result['code'];
      }
    });
  }

  calculateNumberofInputs(){
    //calculate Number of Inputs
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Show) {
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Show) {
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Count = this.NUMBER_OF_INPUTS;
    }
    if(this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours && this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Show){
      this.NUMBER_OF_INPUTS ++;
      this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Count = this.NUMBER_OF_INPUTS;
    } else {
      this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Show = false;
    }


    if(this.NUMBER_OF_INPUTS <= 2){
      this.PADDING_TOP = "10";
      this.WEB_CAM_HEIGHT = "25";
      this.WEB_CAM_WIDTH = "25";
    }else if(this.NUMBER_OF_INPUTS > 2 && this.NUMBER_OF_INPUTS <= 4){
      this.PADDING_TOP = "8";
      this.WEB_CAM_HEIGHT = "20";
      this.WEB_CAM_WIDTH = "20";
    }else if(this.NUMBER_OF_INPUTS > 4 && this.NUMBER_OF_INPUTS <= 6){
      this.PADDING_TOP = "5";
    }else if(this.NUMBER_OF_INPUTS > 6){
      //this.PADDING_TOP = "3";
      this.PADDING_TOP = "1";

    }
    this.WEB_CAM_BADG_MARGIN = "calc(" + this.WEB_CAM_HEIGHT + "vh - 30px)";

    switch (this.NUMBER_OF_INPUTS) {
        case 8:
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Show) {
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Show) {
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = false;
            }

          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Count < 5) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = false;
            }
          }
          break;

          case 9:
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Show) {
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Show) {
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = false;
            }

          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = false;
            }
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Show){
            if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Count < 6) {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = true;
            } else {
              this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = false;
            }
          }
          break;
          case 10:
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Show) {
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Show) {
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = false;
              }

            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = false;
              }
            }
            if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Show){
              if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Count < 6) {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = true;
              } else {
                this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = false;
              }
            }
            break;
            case 11:
            case 12:
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Show) {
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Show) {
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = false;
                }

              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = false;
                }
              }
              if(this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Show){
                if (this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Count < 7) {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Page1 = true;
                } else {
                  this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Page1 = false;
                }
              }
              break;
      default:
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Show) {
            this.KIOSK_PROPERTIES.COMMON_CONFIG.VisitorId.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Show) {
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Name.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Company.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Category.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Contact.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailId.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Vehicle.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Purpose.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Host.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Country.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.Gender.Page1 = true;
          }
          if(this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Show){
            this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours.Page1 = true;
          }

        break;
    }
  }
  openBottomHostSelect(): void {
    const host = this.bottomSheet.open(BottomSheetHostSelect);
    host.afterDismissed().subscribe(result => {
      if(result != undefined){
        console.log(result);
        this.aptmDetails.hostDetails.id = result['HOSTIC'];
        this.aptmDetails.hostDetails.name = result['HOSTNAME'];
        this.aptmDetails.hostDetails.company = result['COMPANY_REFID'];
        this.aptmDetails.hostDetails.contact = result['HostExt'];
        this.aptmDetails.hostDetails.email = result['HOST_EMAIL'];
        this.aptmDetails.hostDetails.HostDeptId = result['DEPARTMENT_REFID'];
        console.log(this.aptmDetails.hostDetails.id);
      }
    });
  }

  _getAllPurposeOfVisit(){
    this.apiServices.localPostMethod('getPurpose',{}).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        localStorage.setItem('_PURPOSE_OF_VISIT', data[0]["Data"]);
        console.log("--- Purpose of Visit Updated");
      }
    },
    err => {
      console.log("Failed...");
      return false;
    });
  }
  textDataBindTemp(value : string, elm:string ) {
    console.log(value);
    this['aptmDetails'][elm] = value;
  }
  itFocusOut(value : any, elm:string ){
    if(elm === "id" && value != "" ){
      console.log("itFocusOut" + value);
      this.getVisitorDetails(value);
    }
  }
  onKey(value: string, event: any) {
    console.log("onKey: " + value);
    if (value.length > 1) {
      this.getVisitorDetails(value);
    } else {
      this.aptmDetails.visitorB64Image = "";
      this.aptmDetails.name = "";
      this.aptmDetails.company =  "";
      this.aptmDetails.email = "";
      this.aptmDetails.contact = "";
      this.aptmDetails.vehicle = "";
      this.aptmDetails.visitor_blacklist = false;
    }
  }

  onKeydown(event) {
    console.log(event);
    if (event.key === "Enter") {
      console.log(event);
    }
  }

  update(value: string) {
    console.log("update: " + value);
  }

  validateAndReturnEmail() {
    var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (EMAIL_REGEXP.test(this.aptmDetails.email)) {
      this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailIdValidated = true;
    } else {
      this.KIOSK_PROPERTIES.COMMON_CONFIG.EmailIdValidated = false;
    }

   return this.aptmDetails.email.toLowerCase();
  }

  getVisitorDetails(att_visitor_id:string){
    let uploadarray = {"att_visitor_id": att_visitor_id}
    this.apiServices.localPostMethod('getVisitorInformation',uploadarray).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"]){
        let _data = data[0]["Data"];
        if(_data["Table"] != undefined && _data["Table"].length > 0 && _data["Table"][0]["Code"] == '10'){
          if(_data["Table1"] != undefined && _data["Table1"].length > 0){
            let visitorInfo = _data["Table1"][0];
            this.aptmDetails.visitorB64Image = "data:image/jpeg;base64," + visitorInfo.Photo;
            this.aptmDetails.name = visitorInfo.visitor_name|| "";
            this.aptmDetails.company = visitorInfo.company_name || "";
            this.aptmDetails.email = visitorInfo.visitor_email || "";
            this.aptmDetails.contact = visitorInfo.visitor_mobile_no || "";
            this.aptmDetails.vehicle = visitorInfo.visitor_vehicle_no || "";
            this.aptmDetails.visitor_blacklist = visitorInfo.visitor_blacklist || "";
           // console.log(visitorInfo);
          } else {
            this.aptmDetails.visitor_blacklist = false;
          }
        }
      }
    },
    err => {
      return false;
    });
  }

  showFirstPageFields = true;
  NUMBER_OF_INPUTS:number = 0;
  PADDING_TOP:string = "3";
  WEB_CAM_HEIGHT:string = "15";
  WEB_CAM_WIDTH:string = "15";
  WEB_CAM_BADG_MARGIN = "calc(" + this.WEB_CAM_HEIGHT + "vh - 30px)";
  KIOSK_PROPERTIES:any = {};
  KIOSK_CHECKIN_COUNTER_NAME:string = "";
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_CHECKIN_COUNTER_NAME = JSON.parse(setngs)['kioskName'];
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
      if (this.mainModule === 'vcheckin') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.CheckinSettings;
        this.KIOSK_PROPERTIES.COMMON_CONFIG.AppointmentHours = {
          Show: false,
          Mandatory: false
        }
        this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video'];
      } else {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.ApptFieldSettings;
        this.KIOSK_PROPERTIES.COMMON_CONFIG.showVideoBrief = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video_preappt']
      }
      this.calculateNumberofInputs();
    }
  }

}
@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: `<mat-nav-list >
              <mat-list-item (click)="selectThisItem($event,purpose)"
              style="height: 4.5vw;border-bottom: 1px solid rgba(0,0,0,0.07);color: #3e5763;"
              *ngFor="let purpose of purposes">
                <span mat-line style="font-size:1.8vw;line-height: 2vw;">{{purpose.visitpurpose_desc}}</span>
              </mat-list-item>
            </mat-nav-list>`,
})
export class BottomSheetPurposeSheet {
  purposes:any;
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetPurposeSheet>,
    private apiServices:ApiServices) {
    this.purposes = [];
    if(localStorage.getItem('_PURPOSE_OF_VISIT') != undefined && localStorage.getItem('_PURPOSE_OF_VISIT') != ''){
      this.purposes = JSON.parse(localStorage.getItem('_PURPOSE_OF_VISIT'));
    }
    this._getAllPurposeOfVisit();
  }

  selectThisItem(event: MouseEvent, purpose:any): void {
    this.bottomSheetRef.dismiss(purpose);
    event.preventDefault();
  }
  _getAllPurposeOfVisit(){
    this.apiServices.localPostMethod('getPurpose',{}).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        this.purposes = JSON.parse(data[0]["Data"]);
        localStorage.setItem('_PURPOSE_OF_VISIT', data[0]["Data"]);
        console.log("--- Purpose of Visit Updated");
      }
    },
    err => {
      console.log("Failed...");
      return false;
    });
  }
}
@Component({
  selector: 'bottom-sheet-category-select',
  template: `<mat-nav-list >
              <mat-list-item style="height: 4.5vw;border-bottom: 1px solid rgba(0,0,0,0.07);color: #3e5763;"
              *ngFor="let cate of vis_categories" (click)="selectThisItem($event,cate)" >
                <span mat-line style="font-size:1.8vw;line-height: 2vw;">{{cate.visitor_ctg_desc}}</span>
              </mat-list-item>
            </mat-nav-list>`,
})
export class BottomSheetCategorySelect {
  vis_categories:any;
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetCategorySelect>,
    private apiServices:ApiServices) {
    this.vis_categories = [];
    if(localStorage.getItem('_CATEGORY_OF_VISIT') != undefined && localStorage.getItem('_CATEGORY_OF_VISIT') != ''){
      this.vis_categories = JSON.parse(localStorage.getItem('_CATEGORY_OF_VISIT'));
    }
    this._getAllCategoryOfVisit();
  }

  selectThisItem(event: MouseEvent, purpose:any): void {
    this.bottomSheetRef.dismiss(purpose);
    event.preventDefault();
  }
  _getAllCategoryOfVisit(){
    this.apiServices.localPostMethod("getVisitorCategory",{}).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        this.vis_categories = JSON.parse(data[0]["Data"]);
        localStorage.setItem('_CATEGORY_OF_VISIT', data[0]["Data"]);
        //{"visitor_ctg_desc":"ATTENDANT","visitor_ctg_id":"ATT"}
        console.log("--- Category of Visitor Updated");
      }
    },
    err => {
      console.log("Failed...");
      return false;
    });
  }
}

@Component({
  selector: 'bottom-sheet-country-select',
  template: `<mat-nav-list >
              <mat-list-item style="height: 4.5vw;border-bottom: 1px solid rgba(0,0,0,0.07);color: #3e5763;"
              *ngFor="let hour of hours" (click)="selectThisItem($event,hour)" >
                <span mat-line style="font-size:1.8vw;line-height: 2vw;">{{hour.name}}</span>
              </mat-list-item>
            </mat-nav-list>`,
})
export class BottomSheetHoursSelect {
  hours:any;
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetHoursSelect>,
    private apiServices:ApiServices) {
    this.hours = [{name:"1 Hour",code:"1"},
    {name:"2 Hour",code:"2"},
    {name:"3 Hour",code:"3"},
    {name:"4 Hour",code:"4"},
    {name:"5 Hour",code:"5"},
    {name:"6 Hour",code:"6"},
    {name:"7 Hour",code:"7"},
    {name:"8 Hour",code:"8"},
    {name:"9 Hour",code:"9"},
    {name:"10 Hour",code:"10"},
    {name:"11 Hour",code:"11"},
    {name:"12 Hour",code:"12"}
  ];
  }

  selectThisItem(event: MouseEvent, coun:any): void {
    this.bottomSheetRef.dismiss(coun);
    event.preventDefault();
  }
}

@Component({
  selector: 'bottom-sheet-country-select',
  template: `<mat-nav-list >
              <mat-list-item style="height: 4.5vw;border-bottom: 1px solid rgba(0,0,0,0.07);color: #3e5763;"
              *ngFor="let coun of vis_country" (click)="selectThisItem($event,coun)" >
                <span mat-line style="font-size:1.8vw;line-height: 2vw;">{{coun.name}}</span>
              </mat-list-item>
            </mat-nav-list>`,
})
export class BottomSheetCountrySelect {
  vis_country:any;
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetCountrySelect>,
    private apiServices:ApiServices) {
    this.vis_country = [{name:"Afghanistan",code:"AF"},{name:"Åland Islands",code:"AX"},{name:"Albania",code:"AL"},{name:"Algeria",code:"DZ"},{name:"American Samoa",code:"AS"},{name:"AndorrA",code:"AD"},{name:"Angola",code:"AO"},{name:"Anguilla",code:"AI"},{name:"Antarctica",code:"AQ"},{name:"Antigua and Barbuda",code:"AG"},{name:"Argentina",code:"AR"},{name:"Armenia",code:"AM"},{name:"Aruba",code:"AW"},{name:"Australia",code:"AU"},{name:"Austria",code:"AT"},{name:"Azerbaijan",code:"AZ"},{name:"Bahamas",code:"BS"},{name:"Bahrain",code:"BH"},{name:"Bangladesh",code:"BD"},{name:"Barbados",code:"BB"},{name:"Belarus",code:"BY"},{name:"Belgium",code:"BE"},{name:"Belize",code:"BZ"},{name:"Benin",code:"BJ"},{name:"Bermuda",code:"BM"},{name:"Bhutan",code:"BT"},{name:"Bolivia",code:"BO"},{name:"Bosnia and Herzegovina",code:"BA"},{name:"Botswana",code:"BW"},{name:"Bouvet Island",code:"BV"},{name:"Brazil",code:"BR"},{name:"British Indian Ocean Territory",code:"IO"},{name:"Brunei Darussalam",code:"BN"},{name:"Bulgaria",code:"BG"},{name:"Burkina Faso",code:"BF"},{name:"Burundi",code:"BI"},{name:"Cambodia",code:"KH"},{name:"Cameroon",code:"CM"},{name:"Canada",code:"CA"},{name:"Cape Verde",code:"CV"},{name:"Cayman Islands",code:"KY"},{name:"Central African Republic",code:"CF"},{name:"Chad",code:"TD"},{name:"Chile",code:"CL"},{name:"China",code:"CN"},{name:"Christmas Island",code:"CX"},{name:"Cocos (Keeling) Islands",code:"CC"},{name:"Colombia",code:"CO"},{name:"Comoros",code:"KM"},{name:"Congo",code:"CG"},{name:"Congo, The Democratic Republic of the",code:"CD"},{name:"Cook Islands",code:"CK"},{name:"Costa Rica",code:"CR"},{name:"Cote D'Ivoire",code:"CI"},{name:"Croatia",code:"HR"},{name:"Cuba",code:"CU"},{name:"Cyprus",code:"CY"},{name:"Czech Republic",code:"CZ"},{name:"Denmark",code:"DK"},{name:"Djibouti",code:"DJ"},{name:"Dominica",code:"DM"},{name:"Dominican Republic",code:"DO"},{name:"Ecuador",code:"EC"},{name:"Egypt",code:"EG"},{name:"El Salvador",code:"SV"},{name:"Equatorial Guinea",code:"GQ"},{name:"Eritrea",code:"ER"},{name:"Estonia",code:"EE"},{name:"Ethiopia",code:"ET"},{name:"Falkland Islands (Malvinas)",code:"FK"},{name:"Faroe Islands",code:"FO"},{name:"Fiji",code:"FJ"},{name:"Finland",code:"FI"},{name:"France",code:"FR"},{name:"French Guiana",code:"GF"},{name:"French Polynesia",code:"PF"},{name:"French Southern Territories",code:"TF"},{name:"Gabon",code:"GA"},{name:"Gambia",code:"GM"},{name:"Georgia",code:"GE"},{name:"Germany",code:"DE"},{name:"Ghana",code:"GH"},{name:"Gibraltar",code:"GI"},{name:"Greece",code:"GR"},{name:"Greenland",code:"GL"},{name:"Grenada",code:"GD"},{name:"Guadeloupe",code:"GP"},{name:"Guam",code:"GU"},{name:"Guatemala",code:"GT"},{name:"Guernsey",code:"GG"},{name:"Guinea",code:"GN"},{name:"Guinea-Bissau",code:"GW"},{name:"Guyana",code:"GY"},{name:"Haiti",code:"HT"},{name:"Heard Island and Mcdonald Islands",code:"HM"},{name:"Holy See (Vatican City State)",code:"VA"},{name:"Honduras",code:"HN"},{name:"Hong Kong",code:"HK"},{name:"Hungary",code:"HU"},{name:"Iceland",code:"IS"},{name:"India",code:"IN"},{name:"Indonesia",code:"ID"},{name:"Iran, Islamic Republic Of",code:"IR"},{name:"Iraq",code:"IQ"},{name:"Ireland",code:"IE"},{name:"Isle of Man",code:"IM"},{name:"Israel",code:"IL"},{name:"Italy",code:"IT"},{name:"Jamaica",code:"JM"},{name:"Japan",code:"JP"},{name:"Jersey",code:"JE"},{name:"Jordan",code:"JO"},{name:"Kazakhstan",code:"KZ"},{name:"Kenya",code:"KE"},{name:"Kiribati",code:"KI"},{name:"Korea, Democratic People'S Republic of",code:"KP"},{name:"Korea, Republic of",code:"KR"},{name:"Kuwait",code:"KW"},{name:"Kyrgyzstan",code:"KG"},{name:"Lao People'S Democratic Republic",code:"LA"},{name:"Latvia",code:"LV"},{name:"Lebanon",code:"LB"},{name:"Lesotho",code:"LS"},{name:"Liberia",code:"LR"},{name:"Libyan Arab Jamahiriya",code:"LY"},{name:"Liechtenstein",code:"LI"},{name:"Lithuania",code:"LT"},{name:"Luxembourg",code:"LU"},{name:"Macao",code:"MO"},{name:"Macedonia, The Former Yugoslav Republic of",code:"MK"},{name:"Madagascar",code:"MG"},{name:"Malawi",code:"MW"},{name:"Malaysia",code:"MY"},{name:"Maldives",code:"MV"},{name:"Mali",code:"ML"},{name:"Malta",code:"MT"},{name:"Marshall Islands",code:"MH"},{name:"Martinique",code:"MQ"},{name:"Mauritania",code:"MR"},{name:"Mauritius",code:"MU"},{name:"Mayotte",code:"YT"},{name:"Mexico",code:"MX"},{name:"Micronesia, Federated States of",code:"FM"},{name:"Moldova, Republic of",code:"MD"},{name:"Monaco",code:"MC"},{name:"Mongolia",code:"MN"},{name:"Montserrat",code:"MS"},{name:"Morocco",code:"MA"},{name:"Mozambique",code:"MZ"},{name:"Myanmar",code:"MM"},{name:"Namibia",code:"NA"},{name:"Nauru",code:"NR"},{name:"Nepal",code:"NP"},{name:"Netherlands",code:"NL"},{name:"Netherlands Antilles",code:"AN"},{name:"New Caledonia",code:"NC"},{name:"New Zealand",code:"NZ"},{name:"Nicaragua",code:"NI"},{name:"Niger",code:"NE"},{name:"Nigeria",code:"NG"},{name:"Niue",code:"NU"},{name:"Norfolk Island",code:"NF"},{name:"Northern Mariana Islands",code:"MP"},{name:"Norway",code:"NO"},{name:"Oman",code:"OM"},{name:"Pakistan",code:"PK"},{name:"Palau",code:"PW"},{name:"Palestinian Territory, Occupied",code:"PS"},{name:"Panama",code:"PA"},{name:"Papua New Guinea",code:"PG"},{name:"Paraguay",code:"PY"},{name:"Peru",code:"PE"},{name:"Philippines",code:"PH"},{name:"Pitcairn",code:"PN"},{name:"Poland",code:"PL"},{name:"Portugal",code:"PT"},{name:"Puerto Rico",code:"PR"},{name:"Qatar",code:"QA"},{name:"Reunion",code:"RE"},{name:"Romania",code:"RO"},{name:"Russian Federation",code:"RU"},{name:"RWANDA",code:"RW"},{name:"Saint Helena",code:"SH"},{name:"Saint Kitts and Nevis",code:"KN"},{name:"Saint Lucia",code:"LC"},{name:"Saint Pierre and Miquelon",code:"PM"},{name:"Saint Vincent and the Grenadines",code:"VC"},{name:"Samoa",code:"WS"},{name:"San Marino",code:"SM"},{name:"Sao Tome and Principe",code:"ST"},{name:"Saudi Arabia",code:"SA"},{name:"Senegal",code:"SN"},{name:"Serbia and Montenegro",code:"CS"},{name:"Seychelles",code:"SC"},{name:"Sierra Leone",code:"SL"},{name:"Singapore",code:"SG"},{name:"Slovakia",code:"SK"},{name:"Slovenia",code:"SI"},{name:"Solomon Islands",code:"SB"},{name:"Somalia",code:"SO"},{name:"South Africa",code:"ZA"},{name:"South Georgia and the South Sandwich Islands",code:"GS"},{name:"Spain",code:"ES"},{name:"Sri Lanka",code:"LK"},{name:"Sudan",code:"SD"},{name:"Suriname",code:"SR"},{name:"Svalbard and Jan Mayen",code:"SJ"},{name:"Swaziland",code:"SZ"},{name:"Sweden",code:"SE"},{name:"Switzerland",code:"CH"},{name:"Syrian Arab Republic",code:"SY"},{name:"Taiwan, Province of China",code:"TW"},{name:"Tajikistan",code:"TJ"},{name:"Tanzania, United Republic of",code:"TZ"},{name:"Thailand",code:"TH"},{name:"Timor-Leste",code:"TL"},{name:"Togo",code:"TG"},{name:"Tokelau",code:"TK"},{name:"Tonga",code:"TO"},{name:"Trinidad and Tobago",code:"TT"},{name:"Tunisia",code:"TN"},{name:"Turkey",code:"TR"},{name:"Turkmenistan",code:"TM"},{name:"Turks and Caicos Islands",code:"TC"},{name:"Tuvalu",code:"TV"},{name:"Uganda",code:"UG"},{name:"Ukraine",code:"UA"},{name:"United Arab Emirates",code:"AE"},{name:"United Kingdom",code:"GB"},{name:"United States",code:"US"},{name:"United States Minor Outlying Islands",code:"UM"},{name:"Uruguay",code:"UY"},{name:"Uzbekistan",code:"UZ"},{name:"Vanuatu",code:"VU"},{name:"Venezuela",code:"VE"},{name:"Viet Nam",code:"VN"},{name:"Virgin Islands, British",code:"VG"},{name:"Virgin Islands, U.S.",code:"VI"},{name:"Wallis and Futuna",code:"WF"},{name:"Western Sahara",code:"EH"},{name:"Yemen",code:"YE"},{name:"Zambia",code:"ZM"},{name:"Zimbabwe",code:"ZW"}];
  }

  selectThisItem(event: MouseEvent, coun:any): void {
    this.bottomSheetRef.dismiss(coun);
    event.preventDefault();
  }
}

@Component({
  selector: 'bottom-sheet-gender-select',
  template: `<mat-nav-list >
              <mat-list-item style="height: 4.5vw;border-bottom: 1px solid rgba(0,0,0,0.07);color: #3e5763;"
              *ngFor="let gender of vis_gender" (click)="selectThisItem($event,gender)" >
                <span mat-line style="font-size:1.8vw;line-height: 2vw;">{{gender.name}}</span>
              </mat-list-item>
            </mat-nav-list>`,
})
export class BottomSheetGenderSelect {
  vis_gender:any;
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetGenderSelect>,
    private apiServices:ApiServices) {
    this.vis_gender= [{name:"Male",code:"1"},{name:"Female",code:"0"},{name:"Other",code:"2"}];
  }

  selectThisItem(event: MouseEvent, gender:any): void {
    this.bottomSheetRef.dismiss(gender);
    event.preventDefault();
  }
}

@Component({
  selector: 'bottom-sheet-host-select',
  template: `
            <!-- <div style="background:red;">
              <input [(ngModel)]="searchText" placeholder="search text goes here">
            </div>| myContains : 'HOSTNAME' : searchText>-->
            <mat-nav-list >
              <mat-list-item style="height: 4.5vw;border-bottom: 1px solid rgba(0,0,0,0.07);color: #3e5763;"
              *ngFor="let host of host_list" (click)="selectThisItem($event,host)">
                <span mat-line style="font-size:1.8vw;line-height: 2vw;">{{host.HOSTNAME}}</span>
              </mat-list-item>
            </mat-nav-list>`,
})
export class BottomSheetHostSelect {
  host_list:any;
  searchText:string = '';
  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetHostSelect>,
    private apiServices:ApiServices) {
    this.host_list = [];
    if(localStorage.getItem('_LIST_OF_HOST') != undefined && localStorage.getItem('_LIST_OF_HOST') != ''){
      this.host_list = JSON.parse(localStorage.getItem('_LIST_OF_HOST'));
    }
    this._getAllHostList();
  }

  selectThisItem(event: MouseEvent, purpose:any): void {
    this.bottomSheetRef.dismiss(purpose);
    event.preventDefault();
  }
  _getAllHostList(){
    this.apiServices.localPostMethod('getHostName',{}).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        this.host_list = JSON.parse(data[0]["Data"]);
        localStorage.setItem('_LIST_OF_HOST', data[0]["Data"]);
        //{"HOSTNAME":"awang","SEQID":225,"COMPANY_REFID":"1","DEPARTMENT_REFID":"","HOSTIC":"awang","HostExt":"","HostFloor":"","HostCardSerialNo":"","HOST_ID":"awang","HOST_EMAIL":"","EMAIL_ALERT":true,"AD_ACTIVE_USER_STATUS":true,"dept_id":null,"dept_desc":null}
        console.log("--- List Of Host Updated");
      }
    },
    err => {
      console.log("Failed...");
      return false;
    });
  }
}

@Component({
  selector: 'dialog-visitor-already-exist',
  template: `
        <h1 mat-dialog-title margin>{{data.title}}</h1>
        <h2 mat-dialog-title margin style="margin-bottom: 3vw !important;">{{data.subTile}}</h2>
        <div mat-dialog-actions margin>
          <button mat-raised-button my-theme-button
          style="margin: auto;"
          [mat-dialog-close]="true" cdkFocusInitial> Ok</button>
        </div>`,
})
export class DialogVisitorAlreadyExist {

  constructor(
    public dialogRef: MatDialogRef<DialogVisitorAlreadyExist>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-take-visitor-picture',
  templateUrl: 'takePictureTemplate.html',
})
export class takeVisitorPictureDialog {
  temp_take_pic = 'assets/images/cus_icons/take_picture.png';
  passAction = '';
  CAPTURE_INTERVAL: any;
  INTERVALTIME_SEC = 0;
  webcamwidth=500;
  webcamheight=375;
  overlayheight=375;
  capturedwidth=500;
  showOverlay = false;
  showOverlayImg = true;
  PictureDialogTitle="";
  constructor(
    public dialogRef: MatDialogRef<takeVisitorPictureDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close({"status":false,"data":""});
  }
  public reCaptureWebcam = false;

  public showWebcam = true;
  public allowCameraSwitch = false;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
      this.showOverLay();
  }

  public triggerSnapshot(): void {
    if(this.showWebcam) {
      this.INTERVALTIME_SEC = 3;
      setTimeout(() => {
        this.CAPTURE_INTERVAL = setInterval(() => {
          this.INTERVALTIME_SEC = this.INTERVALTIME_SEC - 1;
          console.log ("INTERVALTIME_SEC -->" + this.INTERVALTIME_SEC);
          if (this.INTERVALTIME_SEC === 0) {
            clearInterval(this.CAPTURE_INTERVAL);
            this.trigger.next();
            this.INTERVALTIME_SEC = 0;
            this.showOverlay = false;
            this.showOverlayImg=false;
            return;
          }
        }, 1000);
      }, 100);
    } else
    {
      /*
      var lsParam={psJSON:this.webcamImage.imageAsDataUrl};
      this.apiServices.checkFaceExists(JSON.stringify(lsParam)).subscribe((data:any) => {
        if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
          console.log(data);
        }
      },
      err => {
        return false;
      });
      */
      this.dialogRef.close({"status":true,"data":this.webcamImage.imageAsDataUrl, "action": this.passAction});
    }

  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    //console.info('received webcam image', webcamImage);
    // this.webcamImage = webcamImage;
    // this.dialogRef.close({"status":true,"data":webcamImage.imageAsDataUrl});
    this.webcamImage = webcamImage;
    this.reCaptureWebcam=true;
    this.showWebcam=false;
    this.showOverlay = false;
    this.showOverlayImg=true;
  }
  reCaptureWebcamClick(){
    this.showOverLay();
    this.reCaptureWebcam=false;
    this.showWebcam=true;
    this.showOverlayImg=true;
  }
   showOverLay() {
    setTimeout(() => {
      this.showOverlay = true;
      this.showOverlayImg=false;
    }, 1500);
  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

}
