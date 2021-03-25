import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings} from "../../../services/app.settings";
import {MatSnackBar, MatDialog} from '@angular/material';
import { DialogStaffActionAlerts } from '../appointment-detail/appointment-detail.component';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
 HOST_PASSCODE_PIN:any;
 isLogin:boolean = false;
 VM:any = {
   "passcode":"",
   "newPasscode":"",
   "avlCard":"",
   "addCard":"",
   "COM_PORT_CARD":"",
   "NEW_COM_PORT_CARD":"",
   "card_scrnTimOut":"",
   "card_showTimeOutMsgAfter":""
 }
  constructor(private router:Router,
    public snackBar: MatSnackBar,
    private dialog:MatDialog,
    private route: ActivatedRoute,) { 
    this.HOST_PASSCODE_PIN = '';
    this.isLogin = false;
      this._updateSettings();
    
  }
  _updateSettings(){
    this.VM.avlCard = localStorage.getItem('STAF_AVAL_CARD');
    this.VM.passcode = localStorage.getItem('STAF_LOGIN_PASSCODE');
    this.VM.COM_PORT_CARD = localStorage.getItem('COM_PORT_CARD_HANDLER');
    let APP_DEFAULT_SETTIGS = JSON.parse(localStorage.getItem('APP_DEFAULT_SETTIGS'));
    this.VM.card_scrnTimOut = APP_DEFAULT_SETTIGS["card_scrnTimOut"];
    this.VM.card_showTimeOutMsgAfter = APP_DEFAULT_SETTIGS["card_showTimeOutMsgAfter"];
  }
  ngOnInit() {
    
  }
  takeActFor(action:string){
    if(action === "next"){
      let pos1 = AppSettings['APP_DEFAULT_SETTIGS']['PASSCODE'];
      let pos2 = localStorage.getItem('STAF_LOGIN_PASSCODE');
      if((this.HOST_PASSCODE_PIN).toString() === pos1 || (this.HOST_PASSCODE_PIN).toString() === pos2){
        this.isLogin = true;
      }else{
        this.HOST_PASSCODE_PIN = "";
        this.snackBar.open("Invalid Passcode !", "", {duration: 2000});
      }
    }  else if(action === "testing"){
      this.router.navigateByUrl('/testing');
    } else if(action === "back"){
      this.router.navigateByUrl('/staffFlow')
    } else if(action === "add"){
      if((this.VM.addCard).toString().length > 0 && (this.VM.addCard).toString().length < 4){
        let _avl = parseInt(this.VM.avlCard) + parseInt(this.VM.addCard);
        if(_avl < 0){
          _avl = 0;
        }
        localStorage.setItem('STAF_AVAL_CARD', _avl.toString());
        this.VM.addCard = "";
        this.snackBar.open("Available Card updated successfully !", "", {duration: 2000});
      }
      this._updateSettings();
    } else if(action === "min"){
      if((this.VM.addCard).toString().length > 0 && (this.VM.addCard).toString().length < 4){
        let _avl = parseInt(this.VM.avlCard) - parseInt(this.VM.addCard);
        if(_avl < 0){
          _avl = 0;
        }
        localStorage.setItem('STAF_AVAL_CARD', _avl.toString());
        this.VM.addCard = "";
        this.snackBar.open("Available Card updated successfully !", "", {duration: 2000});
      }
      this._updateSettings();
    } else if(action === "save"){
      if((this.VM.newPasscode).toString().length == 6){
        localStorage.setItem('STAF_LOGIN_PASSCODE', (this.VM.newPasscode).toString());
        this.VM.newPasscode = "";
        this.snackBar.open("Passcode updated successfully !", "", {duration: 2000});
      }
      this._updateSettings();
    } else if(action === "savecardcom"){
      if((this.VM.NEW_COM_PORT_CARD).toString() != ""){
        localStorage.setItem('COM_PORT_CARD_HANDLER', (this.VM.NEW_COM_PORT_CARD).toString());
        this.VM.NEW_COM_PORT_CARD = "";
        this.snackBar.open("COM Port Card updated successfully !", "", {duration: 2000});
      }
      this._updateSettings();
    } else if(action === "saveTimeInter"){
      let _temp = JSON.parse(localStorage.getItem('APP_DEFAULT_SETTIGS'));
      _temp["card_scrnTimOut"] = (this.VM.card_scrnTimOut == '')? '0': this.VM.card_scrnTimOut;
      _temp["card_showTimeOutMsgAfter"] = (this.VM.card_showTimeOutMsgAfter == '')? '0': this.VM.card_showTimeOutMsgAfter;
      localStorage.setItem('APP_DEFAULT_SETTIGS', JSON.stringify(_temp));
      this.snackBar.open("Timeout updated successfully !", "", {duration: 2000});
      this._updateSettings();
    }
  }
  onchange(event){
    if (event.key === "Enter") {
      console.log(event);
    }
  }
  ngOnDestroy() {
  }
  textDataBindTemp(value : string, elm:string ) {  
    //console.log(value);
    if(elm === 'HOST_PASSCODE_PIN'){
      this[elm] = value;
    }else{this['VM'][elm] = value;}
    
  }
  closeWindow(action:String){
    // const remote = require('electron').remote;
    // var window = remote.getCurrentWindow();
    if(action === "exit"){
      const dialogRef = this.dialog.open(DialogStaffActionAlerts, {
        width: '250px',
        data: {"title": "Are you sure want to exit from App?", "subTile":"",
        "enbCancel":true,"oktext":"Yes","canceltext":"No"}
      });
  
      dialogRef.afterClosed().subscribe(result => {
         if(result){
          window.close();
         }
      });
    }
  }
}
