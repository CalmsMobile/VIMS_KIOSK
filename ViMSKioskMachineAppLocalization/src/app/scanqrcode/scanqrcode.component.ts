import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ApiServices } from 'src/services/apiService';
import { appConfirmDialog } from '../flow-visitor/flow-visitor.component';

@Component({
  selector: 'app-scanqrcode',
  templateUrl: './scanqrcode.component.html',
  styleUrls: ['./scanqrcode.component.scss']
})
export class ScanqrcodeComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;
  private scanType:string ='';
  constructor(private router:Router,
    private dialog:MatDialog,
    private apiServices:ApiServices,
    private route: ActivatedRoute) { }
    temp_take_pic = 'assets/images/cus_icons/take_picture.png';
  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.scanType = params['scanType'];
        if(this.scanType == undefined || this.scanType == ''){
          this.router.navigateByUrl('/landing');
        }
      });
      this._init_QRScanner()

  }
  private _init_QRScanner(){
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      if (videoDevices.length > 0){
          let choosenDev;
          for (const dev of videoDevices){
              if (dev.label.includes('front')){
                  choosenDev = dev;
                  break;
              } else if (dev.label.indexOf('Logitech') > -1){
                choosenDev = dev;
                break;
            }
          }
          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
      }
  });

  this.qrScannerComponent.capturedQr.subscribe(result => {
      console.log(result);
      if(this.scanType === "PREAPPOINTMT"){
        this.router.navigate(['/visitorPreApontmnt'], {queryParams: {scanData:result}});
      } else if(this.scanType === "LICENCEQR"){
        this.router.navigate(['/getKioskCode'], {queryParams: {scanData:result}});
      } else if (this.scanType === "CHECKOUT"){
        this.getAppointmentDetails(result);
      }

  });
  }

  getAppointmentDetails(APONTMNT_CODE){
    document.getElementById("bodyloader").style.display = "block";
    let prepareData = {"hexcode": (APONTMNT_CODE).toString()};
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
            const dialogRef = this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: {title: "ID การนัดหมายไม่ถูกต้อง", btn_ok:"ตกลง"}
            });
            dialogRef.afterClosed().subscribe(result => {
              if(result){
                this.router.navigateByUrl('/visitorCheckout');
              }
           });
          }
        }else if(Data["Table"]!= undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] > 10){
          const dialogRef =  this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: {title: Data["Table"][0]['description'] ? Data["Table"][0]['description']: "ID การนัดหมายไม่ถูกต้อง", btn_ok:"ตกลง"}
          });
          dialogRef.afterClosed().subscribe(result => {
            if(result){
              this.router.navigateByUrl('/visitorCheckout');
            }
         });
        }else{
          const dialogRef =  this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: {title: "ID การนัดหมายไม่ถูกต้อง", btn_ok:"ตกลง"}
          });
          dialogRef.afterClosed().subscribe(result => {
            if(result){
              this.router.navigateByUrl('/visitorCheckout');
            }
         });
        }
      }else{
        const dialogRef =  this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: {title: "ID การนัดหมายไม่ถูกต้อง", btn_ok:"ตกลง"}
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.router.navigateByUrl('/visitorCheckout');
          }
       });
      }
    },
    err => {
      document.getElementById("bodyloader").style.display = "none";
      const dialogRef = this.dialog.open(appConfirmDialog, {
        width: '250px',
        data: {title: err && err.message ? err.message : "ID การนัดหมายไม่ถูกต้อง", btn_ok:"ตกลง"}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.router.navigateByUrl('/visitorCheckout');
        }
     });
      return false;
    });
  }

  takeActFor(action:string){
    if(action === "back"){
      if(this.scanType === "PREAPPOINTMT"){
       this.router.navigate(['/visitorPreApontmnt'], {queryParams: {  }});
      } else if(this.scanType === "LICENCEQR"){
        this.router.navigate(['/getKioskCode'], {queryParams: {  }});
      } else if (this.scanType === "CHECKOUT"){
        this.router.navigateByUrl('/visitorCheckout');
      }
    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }
}
