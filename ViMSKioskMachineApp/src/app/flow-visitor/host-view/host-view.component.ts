import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatBottomSheet, MatDialog, MatDialogRef } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { takeVisitorPictureDialog } from '../appointment-detail/appointment-detail.component';
import { WebcamInitError, WebcamImage, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { appConfirmDialog } from '../flow-visitor.component';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.scss']
})
export class HostViewComponent implements OnInit {

  host: any;
  apiUrl = '';
  image = '';
  isUpdateReady: any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private apiServices: ApiServices) {

    this._updateKioskSettings();


  }

  ngOnInit() {
    this.apiUrl = this.apiServices._getAPIURL();
    this.route
      .queryParams
      .subscribe(params => {
        debugger
        this.host = params;
        if (this.host.ImgBased64) {
          //this.image = this.apiUrl + this.host.ImgPathUrl;
          this.image = this.host.ImgBased64;
        } else {

        }
      });

  }
  KIOSK_PROPERTIES: any = {};
  _updateKioskSettings() {
    localStorage.setItem("VISI_SCAN_DOC_VERIFICATION_DATA", "");
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.HostEnrolmentSettings;
    }
  }
  takeActFor(action: string) {
    if (action == 'back')
      this.router.navigate(['/host-enrolment'], { queryParams: { docType: "HostEnrolment" } });
    if (action == 'Update')
      this.UpdateHostPhoto(this.image);
  }
  UpdateHostPhoto(image) {
    document.getElementById("bodyloader").style.display = "block";
    let prepareData: any = "";
    var img = image.split(',')[1];
    prepareData = { "HostPhoto": img, "MemberId": this.host.MemberId };
    console.log(JSON.stringify(prepareData));
    this.apiServices.localPostMethod("UpdateHostPhoto", prepareData).subscribe((data: any) => {
      console.log("UpdateHostPhoto " + JSON.stringify(data));
      document.getElementById("bodyloader").style.display = "none";
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        debugger
        let Data = JSON.parse(data[0]["Data"]);
        if (Data["Table"] != undefined && Data["Table"].length > 0 && Data["Table"][0]['Code'] == 10) {

          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: { title: Data["Table"][0]['description'], btn_ok: "Ok" }
          });
          this.router.navigate(['/host-enrolment'], { queryParams: { docType: "HostEnrolment" } });

        } else {
          this.dialog.open(appConfirmDialog, {
            width: '250px',
            data: { title: Data["Table"][0]['description'], btn_ok: "Ok" }
          });
        }
      }
    },
      err => {
        document.getElementById("bodyloader").style.display = "none";
        this.dialog.open(appConfirmDialog, {
          width: '250px',
          data: { title: 'Error', btn_ok: "Ok" }
        });
        return false;
      });
  }
  takeVistorProfilePicture(action1, visitorB64Image) {
    const dialogRef = this.dialog.open(takeHostPictureDialog, {
      disableClose: true,
      data: { action: action1, vImg: visitorB64Image }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result.status) {
        console.log(result.data);
        this.image = result.data;
        if (result.data)
          this.isUpdateReady = true;
      }
    });
  }


}
@Component({
  selector: 'dialog-take-visitor-picture',
  templateUrl: 'takepicture.html',
})
export class takeHostPictureDialog {
  temp_take_pic = 'assets/images/cus_icons/take_picture.png';
  passAction = '';
  CAPTURE_INTERVAL: any;
  INTERVALTIME_SEC = 0;
  webcamwidth = 500;
  webcamheight = 375;
  overlayheight = 375;
  capturedwidth = 500;
  showOverlay = false;
  showOverlayImg = true;
  PictureDialogTitle = "";
  constructor(
    public dialogRef: MatDialogRef<takeVisitorPictureDialog>,
    @Inject(MAT_DIALOG_DATA) public data) {
    console.log(data['vImg']);
  }

  onNoClick(): void {
    this.dialogRef.close({ "status": false, "data": "" });
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
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public ngOnInit(): void {
    if (this.data['vImg'] != "") {
      this.showWebcam = false;
      this.reCaptureWebcam = true;
    }
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });


    this.showOverLay();
  }

  public triggerSnapshot(): void {
    if (this.showWebcam) {
      this.INTERVALTIME_SEC = 3;
      setTimeout(() => {
        this.CAPTURE_INTERVAL = setInterval(() => {
          this.INTERVALTIME_SEC = this.INTERVALTIME_SEC - 1;
          console.log("INTERVALTIME_SEC -->" + this.INTERVALTIME_SEC);
          if (this.INTERVALTIME_SEC === 0) {
            clearInterval(this.CAPTURE_INTERVAL);
            this.trigger.next();
            this.INTERVALTIME_SEC = 0;
            this.showOverlay = false;
            this.showOverlayImg = false;
            return;
          }
        }, 1000);
      }, 100);
    } else {
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
      this.dialogRef.close({ "status": true, "data": this.data['vImg'] != "" ? this.data['vImg'] : this.webcamImage.imageAsDataUrl, "action": this.passAction });
    }

  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
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
    this.reCaptureWebcam = true;
    this.showWebcam = false;
    this.showOverlay = false;
    this.showOverlayImg = true;
  }
  reCaptureWebcamClick() {
    this.data['vImg'] = "";
    this.showOverLay();
    this.reCaptureWebcam = false;
    this.showWebcam = true;
    this.showOverlayImg = true;
  }
  showOverLay() {
    setTimeout(() => {
      this.showOverlay = true;
      this.showOverlayImg = false;
    }, 1500);
  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}


