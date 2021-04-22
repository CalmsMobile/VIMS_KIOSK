import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import {Location} from '@angular/common';
import { AppSettings } from 'src/services/app.settings';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../flow-visitor/registration-type/registration-type.component';
@Component({
  selector: 'app-questionnaries',
  templateUrl: './questionnaries.component.html',
  styleUrls: ['./questionnaries.component.scss']
})


export class QuestionnariesComponent implements OnInit {
  position = -1;
  QuestionsDisplay:any = []
  isPlayVideo = false;
  videoPath = '';
  KIOSK_PROPERTIES:any = {};
  mainModule = '';
  KIOSK_CHECKIN_COUNTER_NAME:string = "";
  docType = '';
  constructor(private apiServices:ApiServices,
    public dialog: MatDialog,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {

    this.route
      .queryParams
      .subscribe(params => {
        this.docType = params['docType'];
        this.videoPath = params['video'];
        const ques = params['questions'];
        if (ques) {
          this.QuestionsDisplay = JSON.parse(ques);
        }

    });
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      this.mainModule = localStorage.getItem(AppSettings.LOCAL_STORAGE.MAIN_MODULE);
      if (this.mainModule === 'vcheckin') {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.CheckinSettings;
      } else {
        this.KIOSK_PROPERTIES.COMMON_CONFIG = this.KIOSK_PROPERTIES.ApptFieldSettings;
      }
    }

    const Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_Questionnaries'];
    if (Questionnaries) {
      if (this.QuestionsDisplay.length > 0) {
        this.position = 0;
      } else {
        const dialogRef = this.dialog.open(DialogAlertBox, {
          //width: '50vw',
          data: {"title": "Questions not found", "subTile":"Please contact admin." }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.goBack(false);
        });

      }
      console.log("QuestionsDisplay", JSON.stringify(this.QuestionsDisplay));
    } else {
      this.playVideo()
    }

  }

  takeActFor(action) {
    console.log('position: ' + this.position);
    if (action === 'yes') {
      this.QuestionsDisplay[this.position].Answer = 1;
      const currentQuestion = this.QuestionsDisplay[this.position];
      if (currentQuestion) {
        if (currentQuestion && (currentQuestion.AcceptedAns === '1' || currentQuestion.AcceptedAns === 1)) {
          if (this.position + 1 === this.QuestionsDisplay.length) {
            console.log('Reached End');
            this.playVideo();
          } else {
            this.position = this.position + 1;
          }
        } else {
          this.alertForWrongAnswer();
        }
      }

    } else if (action === 'no'){
      this.QuestionsDisplay[this.position].Answer = 0;
      const currentQuestion = this.QuestionsDisplay[this.position];
      if (currentQuestion) {
        if (currentQuestion && (currentQuestion.AcceptedAns === '0' || currentQuestion.AcceptedAns === 0)) {
          if (this.position + 1 === this.QuestionsDisplay.length) {
            console.log('Reached End');
            this.playVideo();
          } else {
            this.position = this.position + 1;
          }
        } else {
          this.alertForWrongAnswer();
        }
      }
    } else if (action === 'next') {



    } else if (action === 'prev'){
      if ((this.position - 1) <= 0) {
        console.log('Reached first');
        this.goBack(true);
      } else {
        this.position = this.position - 1;
      }
    }
  }

  goBack(back) {
    let uploadArray:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    let listOfVisitors:any = uploadArray['visitorDetails'];
    const currentVisitor = listOfVisitors[listOfVisitors.length - 1];
    if (listOfVisitors.length > 0) {
      listOfVisitors.splice(-1, 1);
    }
    // listOfVisitors.push(this.aptmDetails);
    uploadArray['visitorDetails'] = listOfVisitors;
    localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));
    if (back) {
      // this._location.back();
      this.router.navigate(['/visitorAppointmentDetail'], { queryParams:
        { resumeData: true,
          docType: this.docType,
          visitorData : JSON.stringify(currentVisitor),
          video: this.videoPath,
          questions : JSON.stringify(this.QuestionsDisplay),
        }})
    } else {
      this.router.navigateByUrl('/landing');
    }

  }

  vidEnded() {
    console.log("Video Ended");
    if(this._updateVisitorList()){
      this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
    } else{
      const dialogRef = this.dialog.open(DialogAlertBox, {
        //width: '50vw',
        data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.goBack(false);
      });
    }
  }

  videoFailed() {
    console.log("Video Failed");
    const dialogRef = this.dialog.open(DialogAlertBox, {
      //width: '50vw',
      data: {"title": "Error", "subTile":"Error while playing video. Please contact admin." }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.goBack(true);
    });
  }

  playVideo() {
    let showVideoBrief = false;
    if (this.mainModule === 'vcheckin') {
      showVideoBrief = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video'];
    } else {
      showVideoBrief = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video_preappt'];
    }
    if (showVideoBrief && this.videoPath) {

      this.isPlayVideo = true;
      // this.videoPath = 'http://commondatastorage.googleapis.com/gtv-videos-bucket1/sample/ForBiggerBlazes.mp4';
    } else {
      if(this._updateVisitorList()){
        this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
      } else{
        const dialogRef = this.dialog.open(DialogAlertBox, {
          //width: '50vw',
          data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.goBack(false);
        });
      }
    }

  }

  _updateVisitorList() {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
    let uploadArray:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    let listOfVisitors:any = uploadArray['visitorDetails'];
    const VisitorAnswersLocal = [];
    this.QuestionsDisplay.forEach(element => {
      const item = {
        id: element.QuestionariesSeqId,
        value : element.Answer,
        ValidationRequired: element.ValidationRequired ? 1 : 0
      }
      VisitorAnswersLocal.push(item);
    });
    listOfVisitors[listOfVisitors.length - 1].VisitorAnswers = JSON.stringify(VisitorAnswersLocal);
    uploadArray['visitorDetails'] = listOfVisitors;
    localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(uploadArray));
    return true;
  }

  alertForWrongAnswer() {

    const dialogRef = this.dialog.open(DialogPrepareForScanComponent1, {
      width: '250px',
      disableClose:false,
      data: {
        "title": 'Warning',
        "subTile": 'Oops, based on your answer, you are not permitted to proceed. Click \'Yes\' to recheck your answer or click \'No\' to cancel the check-in & process to registration counter.',
        "cancel":'No',
        "ok":'Yes'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === 'exit'){
        this.router.navigateByUrl('/landing');
      } else{

      }
    });
  }

}



@Component({
  selector: 'dialog-mobile-verify-dialog',
  template: `
        <h1 mat-dialog-title margin>{{data.title}}</h1>
        <h2 mat-dialog-title margin style="margin-bottom: 3vw !important;">{{data.subTile}}</h2>
        <div mat-dialog-actions margin style="margin: 0 auto !important;display: table;">
          <button (click)="proceed()" mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > {{data.cancel}}</button>
          <button (click)="retry()" mat-raised-button my-theme-button [mat-dialog-close]="true"> {{data.ok}}</button>
        </div>`,
})
export class DialogPrepareForScanComponent1 {

  constructor(
    public dialogRef: MatDialogRef<DialogPrepareForScanComponent1>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  retry():void {
    this.dialogRef.close('retry');
  }

  proceed():void {
    this.dialogRef.close('exit');
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
export class DialogAlertBox {

  constructor(
    public dialogRef: MatDialogRef<DialogAlertBox>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
