import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import {Location} from '@angular/common';
import { MatVideoComponent } from 'mat-video/lib/video.component';
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
  @ViewChild('video') matVideo: any;
  KIOSK_PROPERTIES:any = {};
  KIOSK_CHECKIN_COUNTER_NAME:string = "";
  video;
  constructor(private apiServices:ApiServices,
    public dialog: MatDialog,
    private _location: Location,
    private router: Router) {
  }

  ngOnInit() {

    // this.QuestionsDisplay= [{
    //   ID: '1',
    //   Description: 'Have you been contact with COVID person? If Yes, please donot contact with anyone. Keep distance.'
    // },{
    //   ID: '2',
    //   Description: 'Have you been infected with fever?'
    // },{
    //   ID: '3',
    //   Description: 'Have you been travelled across any country recently?'
    // },{
    //   ID: '4',
    //   Description: 'DO you have any COVID symptoms?'
    // }];
    // if (this.QuestionsDisplay.length > 0) {
    //   this.position = 0;
    // }
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
    const Questionnaries = this.KIOSK_PROPERTIES['modules']['Questionnaries']['Enable_Questionnaries'];

    let uploadArray:any = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    console.log("QuestionsDisplay", JSON.stringify(this.QuestionsDisplay));
    const postdata = {
      "VisitorCategory": uploadArray.visitorDetails[0].categoryId
      }
    this.apiServices.localPostMethod('GetQuestionaries' , postdata).subscribe((data: any)=>{

      try {

        let api = this.apiServices._getAPIURL();
        if (api.split('api').length > 1) {
          api = api.split('api')[0];
        }
        const resultData = JSON.parse(data[0].Data);
        if (resultData.Table1.length > 0) {
          this.videoPath = api + resultData.Table1[0].VideoUrl;
        }

      } catch (error) {

      }

      if (Questionnaries) {
        this.QuestionsDisplay= JSON.parse(data[0].Data).Table;
        if (this.QuestionsDisplay.length > 0) {
          this.position = 0;
        } else {
          const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
            //width: '50vw',
            data: {"title": "Questions not found", "subTile":"Please contact admin." }
          });
          this._location.back();
        }
        console.log("QuestionsDisplay",data);
      } else {
        this.playVideo()
      }

    });

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
      if ((this.position - 1) === 0) {
        console.log('Reached first');
        this._location.back();
      } else {
        this.position = this.position - 1;
      }
    }
  }

  playVideo() {

    const Enable_Safety_brief_video = this.KIOSK_PROPERTIES['modules']['Safety_briefing']['Enable_Safety_brief_video'];
    if (Enable_Safety_brief_video) {
      this.isPlayVideo = true;
      if (!this.videoPath) {
        const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
          //width: '50vw',
          data: {"title": "Questions not found", "subTile":"Please contact admin." }
        });
        this._location.back();
        return;
      }
      // this.videoPath = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      setTimeout(() => {
        this.video = this.matVideo.getVideoTag();
        // // this.renderer.listen(this.video, 'ended', () => console.log('video ended'));
        this.video.addEventListener('ended', () => {
          console.log('video ended');

          if(this._updateVisitorList()){
            this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
          } else{
            const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
              //width: '50vw',
              data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
            });
          }
        });
      }, 1000);
    } else {
      if(this._updateVisitorList()){
        this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
      } else{
        const dialogRef = this.dialog.open(DialogVisitorAlreadyExist, {
          //width: '50vw',
          data: {"title": "Visitor already exists in list", "subTile":"Please check your data." }
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
        "subTile": 'You have entered wrong answer. Do you wish to coninue?',
        "cancel":'Retry',
        "ok":'Proceed'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if (this.position + 1 === this.QuestionsDisplay.length) {
          console.log('Reached End');
          this.playVideo();
        } else {
          this.position = this.position + 1;
        }
      } else{

      }
    });
  }

}



@Component({
  selector: 'dialog-mobile-verify-dialog',
  template: `
        <h2 mat-dialog-title margin-top>{{data.title}}</h2>
        <h2 mat-dialog-title margin-top style="margin-bottom: 3vw;">{{data.subTile}}</h2>
        <div mat-dialog-actions margin>
          <button (click)="retry()" mat-raised-button my-theme-alt-button margin-right [mat-dialog-close]="false" > {{data.cancel}}</button>
          <button (click)="proceed()" mat-raised-button my-theme-button [mat-dialog-close]="true"> {{data.ok}}</button>
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
    this.dialogRef.close();
  }

  proceed():void {
    this.dialogRef.close('continue');
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
