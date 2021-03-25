import { Component, OnInit, ViewChild } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-scanqrcode',
  templateUrl: './scanqrcode.component.html',
  styleUrls: ['./scanqrcode.component.scss']
})
export class ScanqrcodeComponent implements OnInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;
  private scanType:string =''; 
  constructor(private router:Router,
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
      }
      
  });
  }
  takeActFor(action:string){
    if(action === "back"){
      if(this.scanType === "PREAPPOINTMT"){
       this.router.navigate(['/visitorPreApontmnt'], {queryParams: {  }});
      } else if(this.scanType === "LICENCEQR"){
        this.router.navigate(['/getKioskCode'], {queryParams: {  }});
      }
    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }
}
