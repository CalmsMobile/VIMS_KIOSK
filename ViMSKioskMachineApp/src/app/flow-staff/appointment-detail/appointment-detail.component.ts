import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { AppSettings } from 'src/services/app.settings';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent implements OnInit {

  sub:any;page:any;
  isLoading:boolean = false;
  listOFvisitors:number = 0;
  staffOTP:any = "";
  showMsg:boolean = false;
  AVAL_VISITORS:any = []; 
  CURRENT_VISTOR_CHCKIN_DATA_FOR_PRINT:any; 
  GScopeValue:any = ""; GVisitorPass:any = ""; GPermittedTime:any = "";
  @ViewChild('cardSerInput') cardSerInput:ElementRef;
  constructor(
    private apiServices:ApiServices, 
    private router:Router,
    private dialog:MatDialog,
    public datePipe:DatePipe,
    private route: ActivatedRoute) { 
       this.AVAL_VISITORS = [];
       var infoData = {
        IsIndividual: false,
        VisitorGender: "",
        VisitorCompany: "",
        VisitorRace: "",
        VisitorState: "",
        VisitorCountry: "",
        VisitorCategory: "",
        VisitorCategoryText: "",
        Email: "",
        Contact: "",
        HostName: "",
        HostNameText: "",
        HostPurpose: "",
        HostPurposeText: "",
        NoOfPerson: "1",
        VehicleNo: "",
        ExpiryTime: "",
        smardno: "",
        HostCompany: "",
        CheckInLocation: "",
        otherInfo: {
            isView: false,
            departname: "",
            floorname: "",
        },
        Hexnumber: 0
    }
    var visitorInfo = {
        Nric: "",
        Name: "",
        ImgSrc: "",
        DocSrc: "",
        Hexnumber: ""
    }
    this.GScopeValue = { infoData: infoData, visitorInfo: visitorInfo };
    this.GScopeValue.getDayweek =  function() {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(new Date()).getDay()];
    } 
    let getDateTime = ()=>{
      return this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
    }
    this.GScopeValue.getDate = function () {
        return getDateTime();
    }
    setInterval(()=>{
    if(this.cardSerInput != undefined)
      this.cardSerInput.nativeElement.focus();
    },100);

  }

  ngOnInit() {
    console.log("%c ---------- App Component Distroy: %s", AppSettings.LOG_FAILED, this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a'));
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.page = params['page'] || "in";
        this.staffOTP = params['otp'] || "";
        if(this.staffOTP === ''){
          this.router.navigateByUrl('/landing');
        } else{
          this.getAllVisitorDetails(this.page);
        }
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  takeActFor(action:string){
    console.log("avction",action)
    if(action === "adminsettings"){
      //this.router.navigateByUrl('/visitorHostMobNumber')
    }else if(action === "dproceed"){
      this._updateAndNextVisitor();
    }else if(action === "proceed"){
      this.getDeviceConnectionData('SetCardIn');
    }else if(action === "signOut"){
      this.checkOutAllVisitors();
    }else if(action === "home"){
      this.router.navigateByUrl('/landing');
    }
  }
  getAllVisitorDetails(type:string){
    let Prepare = {"hostnumber":(this.staffOTP).toString(), "type": type};
    this.isLoading = true;
    this.apiServices.getVisitorInfo(Prepare).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        let Data = JSON.parse(data[0]["Data"]);
        console.log(Data)
        if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10){
          if(Data["Table1"]!= undefined && Data["Table1"].length > 0){
            this.AVAL_VISITORS = Data["Table1"];
            console.log(this.AVAL_VISITORS);
            this.GScopeValue.visitorInfo.Nric = this.AVAL_VISITORS[0].att_visitor_id;
            this.GScopeValue.visitorInfo.Name = this.AVAL_VISITORS[0].visitor_name;
            this.GScopeValue.infoData.VehicleNo = this.AVAL_VISITORS[0].hostnumber;
            this.GScopeValue.infoData.HostPurposeText = this.AVAL_VISITORS[0].att_reason;
          }
        }
        this.showMsg = true;
      }
      this.isLoading = false;
    },
    err => { 
      this.isLoading = false;
      console.log("Failed...");
      return false;
    });
  }
  getDeviceConnectionData(action:string){

    let req = AppSettings['APP_SERVICES'][action];
    if(action === "SetCardIn"){
      req += localStorage.getItem("COM_PORT_CARD_HANDLER");
      setTimeout(() => {
        this.cardSerInput.nativeElement.value = "";
        this.cardSerInput.nativeElement.focus();
        // this.cardSerInput.nativeElement.value = "1234567890";
        // this.visitorIndividualCheckIn();
        
      });
    }
    this.apiServices.getApiDeviceConnectionRequest(req).subscribe(data => {
      console.log(data);
    },
    err => { 
      console.log("Failed...");
      return false;
    });
  }
  onKeydown(event) {
    //console.log(event);
    var key = event.which || event.keyCode;
    if (key === 13 || event.key == "Enter") { 
      this.visitorIndividualCheckIn();
    }
  }
  visitorIndividualCheckIn(){
    if(this.cardSerInput.nativeElement.value != ""){
      let prepareData = {"visitorref":this.AVAL_VISITORS[0]['visitorref'],"visitorcardno": this.cardSerInput.nativeElement.value}
      this.apiServices.visitorIndividualCheckIn(prepareData).subscribe((data:any) => {
        console.log(data);
        if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
          let Data = JSON.parse(data[0]["Data"]);
          if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10){
            if(Data["Table1"]!= undefined && Data["Table1"].length > 0){
              this.CURRENT_VISTOR_CHCKIN_DATA_FOR_PRINT = Data["Table1"];
              this._updateLocalCardCount();
              this.getDeviceConnectionData('EjectCard');
              if (Data["Table1"].length > 0) {
                if (Data["Table1"][0].PrinterEnable == "1") {
                    this.loadlblprint(Data["Table1"]);
                }
                else if (Data["Table1"][0].ReceiptPrinterEnable == "1") {
                  //this.loadreceiptprint(Data["Table1"]);
                }
                else {
                }
              }
              console.log(this.CURRENT_VISTOR_CHCKIN_DATA_FOR_PRINT);
              //this._updateAndNextVisitor();
            }
          }
        }
      },
      err => {  
        this._updateLocalCardCount();
        this.getDeviceConnectionData('RejectCard');
        console.log("Failed...");
        return false;
      });
    }
  }
  _updateLocalCardCount(){
    let _aval = localStorage.getItem('STAF_AVAL_CARD');
    let afterDisc =  parseInt(_aval) - 1; 
    localStorage.setItem('STAF_AVAL_CARD', afterDisc.toString());
  }
  _updateAndNextVisitor(){
    if(this.AVAL_VISITORS.length > 0){
      (this.AVAL_VISITORS).splice(0,1);
    }
    if(this.AVAL_VISITORS.length > 0){
      this.GScopeValue.visitorInfo.Nric = this.AVAL_VISITORS[0].att_visitor_id;
      this.GScopeValue.visitorInfo.Name = this.AVAL_VISITORS[0].visitor_name;
      this.GScopeValue.infoData.VehicleNo = this.AVAL_VISITORS[0].hostnumber;
      this.GScopeValue.infoData.HostPurposeText = this.AVAL_VISITORS[0].att_reason;
      this.router.navigate(['/questionarrie'],{ queryParams: { page: "in" }});
    }
    if(this.AVAL_VISITORS.length <= 0){
      this.router.navigate(['/staffHostSuccess'],{ queryParams: { page: "in" }});
    }
  }
  _printLabForThisVisitor(){
    let prepare = {"psJSON": JSON.stringify({"SEQ_ID":1,"TEMPLATE_NAME":"Visitor Card","PANEL_WIDTH":"376","PANEL_HEIGHT":"235","PANEL_BG_IMAGE_SIZEMODE":"StretchImage","VISIT_IMAGE_WIDTH":"64","VISIT_IMAGE_HEIGHT":"58","VISIT_IMAGE_SIZEMODE":"StretchImage","VISIT_IMAGE_LOCATION":"{X=10,Y=27}","LABLE1_IS_ENABLE":true,"LABLE1_ASSIGNTO":"Visitor Name","LABLE1_FONT":"Arial, 11.25pt, style=Bold","LABLE1_COLOR":"Black","LABLE1_LOCATION":"{X=10,Y=104}","LABLE1_WIDTH":"340","LABLE1_HEIGHT":"21","LABLE1_TEXT_MAX":"25","LABLE1_TEXT_ALIGN":"left","LABLE2_IS_ENABLE":true,"LABLE2_ASSIGNTO":"Visitor Vehicle #","LABLE2_FONT":"Arial, 11.25pt, style=Bold","LABLE2_COLOR":"Black","LABLE2_LOCATION":"{X=10,Y=198}","LABLE2_WIDTH":"264","LABLE2_HEIGHT":"20","LABLE2_TEXT_MAX":"23","LABLE2_TEXT_ALIGN":"left","LABLE3_IS_ENABLE":false,"LABLE3_ASSIGNTO":"","LABLE3_FONT":"Calibri, 11pt, style=Bold","LABLE3_COLOR":"White","LABLE3_LOCATION":"{X=25,Y=68}","LABLE3_WIDTH":"73","LABLE3_HEIGHT":"18","LABLE3_TEXT_MAX":"15","LABLE3_TEXT_ALIGN":"left","LABLE4_IS_ENABLE":false,"LABLE4_ASSIGNTO":"","LABLE4_FONT":"Calibri, 11pt, style=Bold","LABLE4_COLOR":"White","LABLE4_LOCATION":"{X=25,Y=95}","LABLE4_WIDTH":"73","LABLE4_HEIGHT":"18","LABLE4_TEXT_MAX":"15","LABLE4_TEXT_ALIGN":"left","LABLE5_IS_ENABLE":true,"LABLE5_ASSIGNTO":"CheckIn Time","LABLE5_FONT":"Arial, 11.25pt, style=Bold","LABLE5_COLOR":"Black","LABLE5_LOCATION":"{X=10,Y=139}","LABLE5_WIDTH":"331","LABLE5_HEIGHT":"18","LABLE5_TEXT_MAX":"25","LABLE5_TEXT_ALIGN":"left","LABLE6_IS_ENABLE":true,"LABLE6_ASSIGNTO":"Visit Reason","LABLE6_FONT":"Arial, 11.25pt, style=Bold","LABLE6_COLOR":"Black","LABLE6_LOCATION":"{X=11,Y=169}","LABLE6_WIDTH":"339","LABLE6_HEIGHT":"18","LABLE6_TEXT_MAX":"25","LABLE6_TEXT_ALIGN":"left","LABLE7_IS_ENABLE":false,"LABLE7_ASSIGNTO":"","LABLE7_FONT":"Calibri, 11pt, style=Bold","LABLE7_COLOR":"White","LABLE7_LOCATION":"{X=130,Y=41}","LABLE7_WIDTH":"73","LABLE7_HEIGHT":"18","LABLE7_TEXT_ALIGN":"left","LABLE7_TEXT_ALIGN1":"16","LABLE8_IS_ENABLE":false,"LABLE8_ASSIGNTO":"","LABLE8_FONT":"Calibri, 11pt, style=Bold","LABLE8_COLOR":"White","LABLE8_LOCATION":"{X=130,Y=68}","LABLE8_WIDTH":"73","LABLE8_HEIGHT":"18","LABLE8_TEXT_MAX":"15","LABLE8_TEXT_ALIGN":"left","LABLE9_IS_ENABLE":false,"LABLE9_ASSIGNTO":"","LABLE9_FONT":"Calibri, 11pt, style=Bold","LABLE9_COLOR":"White","LABLE9_LOCATION":"{X=130,Y=95}","LABLE9_WIDTH":"73","LABLE9_HEIGHT":"18","LABLE9_TEXT_MAX":"15","LABLE9_TEXT_ALIGN":"left","LABLE10_IS_ENABLE":false,"LABLE10_ASSIGNTO":"","LABLE10_FONT":"Calibri, 11pt, style=Bold","LABLE10_COLOR":"White","LABLE10_LOCATION":"{X=130,Y=122}","LABLE10_WIDTH":"73","LABLE10_HEIGHT":"18","LABLE10_TEXT_MAX":"15","LABLE10_TEXT_ALIGN":"left","CARD_LABEL_ORIENTATION":"Landscape","PRINTING_TYPE":"Badge (99014)","PIC_BARCODE_IS_ENABLE":false,"PIC_BARCODE_ASSIGNTO":"","PIC_BARCODE_LOCATION":"{X=255,Y=153}","PIC_BARCODE_WIDTH":"56","PIC_BARCODE_HEIGHT":"48","VISIT_IMAGE_IS_ENABEL":true,"DAY_STATUS_LABLE_IS_ENABLE":false,"LABLE1_TEXT_CASE":"U","LABLE2_TEXT_CASE":"U","LABLE3_TEXT_CASE":"L","LABLE4_TEXT_CASE":"L","LABLE5_TEXT_CASE":"U","LABLE6_TEXT_CASE":"U","LABLE7_TEXT_CASE":"L","LABLE8_TEXT_CASE":"L","LABLE9_TEXT_CASE":"L","LABLE10_TEXT_CASE":"L","DAY_STATUS_LABLE_FONT":"Calibri, 11pt, style=Bold","DAY_STATUS_LABLE_COLOR":"Red","DAY_STATUS_LABLE_LOCATION":"{X=25,Y=143}","DAY_STATUS_LABLE_WIDTH":"73","DAY_STATUS_LABLE_HEIGHT":"18","DAY_STATUS_LABLE_TEXT_MAX":"15","DAY_STATUS_LABLE_TEXT_ALIGN":"left","DAY_STATUS_LABLE_TEXT_CASE":"L","PIC_BARCODE_QR_TYPE":"","ReturnValue":"",
    "bgImage":"",
    "LABLE1_VALUE":"Tharani Sankaran",
    "LABLE2_VALUE":"0123456789",
    "LABLE3_VALUE":"",
    "LABLE4_VALUE":"",
    "LABLE5_VALUE":"10-12-2018 04:58 PM",
    "LABLE6_VALUE":"Admission",
    "LABLE7_VALUE":"",
    "LABLE8_VALUE":"",
    "LABLE9_VALUE":"",
    "LABLE10_VALUE":""})};
    this.apiServices.PrintVisitorLabel(prepare).subscribe((data:any) => {
      console.log(data);
    },
    err => { 
      console.log("Failed...");
      return false;
    });
  }
  checkOutAllVisitors(){
    this.apiServices.visitorCheckOut({"hostnumber":(this.staffOTP).toString()}).subscribe((data:any) => {
      if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
        let Data = JSON.parse(data[0]["Data"]);
        //console.log(Data)
        if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10){
          this.router.navigate(['/staffHostSuccess'],{ queryParams: { page: "out" }});
        }
      }
    },
    err => { 
      console.log("Failed...");
      const dialogRef = this.dialog.open(DialogStaffActionAlerts, {
        width: '250px',
        data: {"title": "Visitor Sign out failed !", "subTile":"Please try again !",
         "enbCancel":false,"oktext":"Ok","canceltext":""}
      });
      return false;
    });
  }
  showAlerttoVisitor(){
    const dialogRef = this.dialog.open(DialogStaffActionAlerts, {
      width: '250px',
      data: {"title": "Please Confirm the host mobile number", "subTile":""}
    });

    dialogRef.afterClosed().subscribe(result => {
       if(result){
       }
    });
  }
  /*Load Dynamic Template Start*/
  loadlblprint(poReturnData) {
      var postData = {}, poReturnVal = "";
      this.apiServices.getPrintTemplateData("{psJson:'" + JSON.stringify(postData) + "'}").subscribe((data:any) => {
        //console.log(data);
        if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
          let Data = JSON.parse(data[0]["Data"]);
          if (Data["Table"]!= undefined && Data["Table"].length > 0) {
            Data["Table"][0].ReturnValue = "";
            //GScopeValue = angular.element(document.getElementsByClassName('ui-view')).scope();
            //GPANEL_BG_IMAGE_NEW = "data:image/png;base64," + Data["Table1"][0].PANEL_BG_IMAGE;
            //var templateContent = $("#myLabelTemplate").html();
            if (poReturnData != undefined) {
                if (poReturnData.length > 0) {
                    this.GVisitorPass = poReturnData[0].VisitorPass || "";
                    poReturnData[0].PermittedTime = "";//new Date(poReturnData[0].PermittedTime);
                    this.GPermittedTime = poReturnData[0].PermittedTime;
                    if ((Data["Table"][0].PIC_BARCODE_ASSIGNTO).trim() != "") {
                        switch (Data["Table"][0].PIC_BARCODE_ASSIGNTO) {
                            case "Visitor NRIC":
                                poReturnVal = poReturnData[0].VisitorNRIC;
                                break;
                            case "Visitor Vehicle #":
                                poReturnVal = poReturnData[0].VisitorVehicle;
                                break;
                            case "Visitor Pass #":
                                poReturnVal = poReturnData[0].VisitorPass;
                                break;
                            case "Smartcard #":
                                poReturnVal = poReturnData[0].Smartcard;
                                break;
                            case "Dynamic Hex #":
                                poReturnVal = poReturnData[0].DynamicHex;
                                break;
                        }
                        Data["Table"][0].ReturnValue = poReturnVal;
                    }
                }
            }
            /*Form Value*/
            Data["Table"][0].bgImage = Data["Table1"][0].PANEL_BG_IMAGE;
            Data["Table"][0].DAY_STATUS_VAL = this.getFieldValue('Day', Data["Table"][0].DAY_STATUS_LABLE_TEXT_MAX, '');
            Data["Table"][0].VImage = this.getFieldValue('VImage', 0, '');
            Data["Table"][0].LABLE1_VALUE = this.getFieldValue(Data["Table"][0].LABLE1_ASSIGNTO, Data["Table"][0].LABLE1_TEXT_MAX, '');
            Data["Table"][0].LABLE2_VALUE = this.getFieldValue(Data["Table"][0].LABLE2_ASSIGNTO, Data["Table"][0].LABLE2_TEXT_MAX, '');
            Data["Table"][0].LABLE3_VALUE = this.getFieldValue(Data["Table"][0].LABLE3_ASSIGNTO, Data["Table"][0].LABLE3_TEXT_MAX, '');
            Data["Table"][0].LABLE4_VALUE = this.getFieldValue(Data["Table"][0].LABLE4_ASSIGNTO, Data["Table"][0].LABLE4_TEXT_MAX, '');
            Data["Table"][0].LABLE5_VALUE = this.getFieldValue(Data["Table"][0].LABLE5_ASSIGNTO, Data["Table"][0].LABLE5_TEXT_MAX, '');
            Data["Table"][0].LABLE6_VALUE = this.getFieldValue(Data["Table"][0].LABLE6_ASSIGNTO, Data["Table"][0].LABLE6_TEXT_MAX, '');
            Data["Table"][0].LABLE7_VALUE = this.getFieldValue(Data["Table"][0].LABLE7_ASSIGNTO, Data["Table"][0].LABLE7_TEXT_MAX, '');
            Data["Table"][0].LABLE8_VALUE = this.getFieldValue(Data["Table"][0].LABLE8_ASSIGNTO, Data["Table"][0].LABLE8_TEXT_MAX, '');
            Data["Table"][0].LABLE9_VALUE = this.getFieldValue(Data["Table"][0].LABLE9_ASSIGNTO, Data["Table"][0].LABLE9_TEXT_MAX, '');
            Data["Table"][0].LABLE10_VALUE = this.getFieldValue(Data["Table"][0].LABLE10_ASSIGNTO, Data["Table"][0].LABLE10_TEXT_MAX, '');
            /*End*/
            //var template = kendo.template(templateContent);
            //var loContent = kendo.render(template, Data["Table"]);
            //$("#dvContents").html(loContent);
            //if (GBarcodeType == 2 && poReturnVal != "") {
            //    if ($("#barqrctrl").data("kendoBarcode") != undefined)
            //        $("#barqrctrl").data("kendoBarcode").destroy();
            //    $("#barqrctrl").kendoBarcode({
            //        value: poReturnVal,
            //        type: "code128",
            //        background: "transparent",
            //        text: {
            //            visible: true
            //        }
            //    });
            //}
            //else if (GBarcodeType == 1 && poReturnVal != "") {
            //    if ($("#barqrctrl").data("kendoQRCode") != undefined)
            //        $("#barqrctrl").data("kendoQRCode").destroy();
            //    $("#barqrctrl").kendoQRCode({
            //        value: poReturnVal,
            //        size: 120,
            //        //color: "#e15613",
            //        background: "transparent"
            //    });
            //}
            //GScopeValue.printDiv();
            //proAjaxCall("POST", "PrintVisitorLabel","{psJSON:'" + JSON.stringify(Data["Table"][0]) + "'}", true, function (data) {
                //GVisitorPass = "";
                //GPermittedTime = "";
                ///*Display Counter*/
                //var counter = GPrintPreviewSec / 1000;
                //var interval = setInterval(function () {
                //    counter--;
                //    if (counter == 0) {//10 seconds
                //        clearInterval(interval);
                //    }
                //    else {
                //        $("#fewseconds").text(counter);
                //    }
                //}, 1000);
                ////Exit in 10 seconds
                //setTimeout(function () {
                //    GVisitorPass = "";
                //    GPermittedTime = "";
                //    $("#btnredirect").trigger("click");
                //}, GPrintPreviewSec);
            //});
            this.apiServices.PrintVisitorLabel({psJSON: JSON.stringify(Data["Table"][0])})
            .subscribe((data:any) => {
                console.log(data);
                this.GVisitorPass = "";
                this.GPermittedTime = "";
                this._updateAndNextVisitor();
            },
            err => { 
              console.log("Failed...");
              return false;
            });

          }
        }
      },
      err => { 
        console.log("Failed...");
        return false;
      });
  }
  getFieldValue(psString, psLength, psCase) {
      var lsReturn = "";

      psString = psString.replace(new RegExp(" ", 'g'), "");
      switch (psString) {
          case "VisitorName":
              lsReturn = (this.GScopeValue.visitorInfo.Name).trim().substring(0, psLength);
              break;
          case "CheckInTime":
              lsReturn = (this.GScopeValue.getDate()).trim().substring(0, psLength);
              break;
          case "Floor":
              lsReturn = (this.GScopeValue.infoData.otherInfo.floorname).trim().substring(0, psLength);
              break;
          case "VisitorNRIC":
              lsReturn = (this.GScopeValue.visitorInfo.Nric).trim().substring(0, psLength);
              break;
          case "VisitorCategory":
              lsReturn = (this.GScopeValue.infoData.VisitorCategoryText).trim().substring(0, psLength);
              break;
          case "VImage":
              lsReturn = this.GScopeValue.visitorInfo.ImgSrc;
              break;
          case "VisitorGender":
              lsReturn = (this.GScopeValue.infoData.VisitorGender).trim().substring(0, psLength);
              break;
          case "VisitorCompany":
              lsReturn = (this.GScopeValue.infoData.VisitorCompany).trim().substring(0, psLength);
              break;
          case "VisitorRace":
              lsReturn = (this.GScopeValue.infoData.VisitorRace).trim().substring(0, psLength);
              break;
          case "VisitorState":
              lsReturn = (this.GScopeValue.infoData.VisitorState).trim().substring(0, psLength);
              break;
          case "VisitorCountry":
              lsReturn = (this.GScopeValue.infoData.VisitorCountry).trim().substring(0, psLength);
              break;
          case "VisitorMobile":
              lsReturn = (this.GScopeValue.infoData.Contact).trim().substring(0, psLength);
              break;
          case "VisitorVehicle#":
              lsReturn = (this.GScopeValue.infoData.VehicleNo).trim().substring(0, psLength);
              break;
          case "VisitorPass#":
              lsReturn = (this.GVisitorPass).toString().trim().substring(0, psLength);
              break;
          case "ExpiryTime":
              lsReturn = this.GPermittedTime;
              break;
          case "HostName":
              lsReturn = (this.GScopeValue.infoData.HostNameText).trim().substring(0, psLength);
              break;
          case "HostPurpose":
              lsReturn = (this.GScopeValue.infoData.HostPurposeText).trim().substring(0, psLength);
              break;
          case "HostDepartment":
              lsReturn = (this.GScopeValue.infoData.otherInfo.departname).trim().substring(0, psLength);
              break;
          case "HostCompany":
              lsReturn = (this.GScopeValue.infoData.HostCompany).trim().substring(0, psLength);
              break;
          case "VisitReason":
              lsReturn = (this.GScopeValue.infoData.HostPurposeText).trim().substring(0, psLength);
              break;
          case "No.OfPerson":
              lsReturn = (this.GScopeValue.infoData.NoOfPerson).trim().substring(0, psLength);
              break;
          case "CheckInLocation":
              lsReturn = (this.GScopeValue.infoData.CheckInLocation).trim().substring(0, psLength);
              break;
          case "ProjectLink":
              lsReturn = "GProURL";
              break;
          case "Day":
              lsReturn = (this.GScopeValue.getDayweek()).trim().substring(0, psLength);
              break;
      }
      return (psCase == "L" ? lsReturn.toLowerCase() : (psCase == "U" ? lsReturn.toUpperCase() : lsReturn));
  }
  loadreceiptprint(poReturnData) {
      var poReturnVal = "";
      if (poReturnData.length > 0) {
          //this.GScopeValue = angular.element(document.getElementsByClassName('ui-view')).scope();
          this.GVisitorPass = poReturnData[0].VisitorPass || "";
          poReturnData[0].VisitorName = this.getFieldValue("VisitorName", 30, "L");
          poReturnData[0].VisitorCompany = this.getFieldValue("VisitorCompany", 30, "L");
          poReturnData[0].VisitorCategory = this.getFieldValue("VisitorCategory", 30, "L");
          poReturnData[0].CheckInTime = this.getFieldValue("CheckInTime", 30, "L");
          poReturnData[0].HostName = this.getFieldValue("HostName", 30, "L");
          poReturnData[0].HostPurpose = this.getFieldValue("HostPurpose", 30, "L");
          poReturnData[0].Floor = this.getFieldValue("Floor", 30, "L");
          poReturnData[0].PermittedTime = "";//new Date(poReturnData[0].PermittedTime);
          this.GPermittedTime = poReturnData[0].PermittedTime;
          if ((poReturnData[0].PrintField) != null && (poReturnData[0].PrintField).toString().trim() != "") {
              switch (poReturnData[0].PrintField) {
                  case "Visitor NRIC":
                      poReturnVal = poReturnData[0].VisitorNRIC;
                      break;
                  case "Visitor Vehicle #":
                      poReturnVal = poReturnData[0].VisitorVehicle;
                      break;
                  case "Visitor Pass #":
                      poReturnVal = poReturnData[0].VisitorPass;
                      break;
                  case "Smartcard #":
                      poReturnVal = poReturnData[0].Smartcard;
                      break;
                  case "Dynamic Hex #":
                      poReturnVal = poReturnData[0].DynamicHex;
                      break;
              }
          }
          poReturnData[0].PrintField = poReturnVal;
      }
      // proAjaxCall("POST", "PrintVisitorReceipt", "{psJSON:'" + JSON.stringify(poReturnData[0]) + "'}", true, function (data) {
      //     GVisitorPass = "";
      //     GPermittedTime = "";
      //     $("#btnredirect").trigger("click");
      // });
      this.apiServices.PrintVisitorLabel("{psJSON:'" + JSON.stringify(poReturnData[0]) + "'}")
      .subscribe((data:any) => {
          this.GVisitorPass = "";
          this.GPermittedTime = "";
        console.log(data);
      },
      err => { 
        console.log("Failed...");
        return false;
      });
  }
  /*Load Dynamic Template End*/
}
@Component({
  selector: 'dialog-mobile-verify-dialog',
  template: `
        <h2 mat-dialog-title margin-top>{{data.title}}</h2>
        <h1 mat-dialog-title margin-top style="margin-bottom: 3vw;">{{data.subTile}}</h1>
        <div mat-dialog-actions margin>
          <button *ngIf="data.enbCancel" 
          mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > {{data.canceltext}}</button>
          <button mat-raised-button my-theme-button [mat-dialog-close]="true"
          style="margin-left:4vw"
           cdkFocusInitial> {{data.oktext}}</button>
        </div>`,
})
export class DialogStaffActionAlerts {

  constructor(
    public dialogRef: MatDialogRef<DialogStaffActionAlerts>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
