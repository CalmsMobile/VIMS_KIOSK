import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { AppSettings} from "../../../services/app.settings";
import {MatSnackBar, MatDialog} from '@angular/material';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';

@Component({
  selector: 'app-staffTemperature',
  templateUrl: './staffTemperature.component.html',
  styleUrls: ['./staffTemperature.component.scss']
})
export class staffTemperatureComponent implements OnInit {
  timeOutCount:number=0;
  RESULT_MSG ="";
  VM:any = {
   "Temperature":"",
   "TempMessage":"",
   "TempTitle":"",
   "HOSTIC":"",
   "MaxTemperature":37.00
  }
  constructor(private router:Router,
    private apiServices:ApiServices,
    public snackBar: MatSnackBar,
    private dialog:MatDialog,
    private route: ActivatedRoute) { 
      this._updateKioskSettings();
    }

  ngOnInit() {
    let _timeout:any = this.KIOSK_PROPERTIES['General']['TemperatureMsgScrnTimeout'];
    //this.RESULT_MSG=this.KIOSK_PROPERTIES['General']['TemperatureMsg'];
    this.VM.MaxTemperature=parseFloat(this.KIOSK_PROPERTIES['General']['AllowedTemperatureLimit']);
    this.VM.TempTitle=this.KIOSK_PROPERTIES['General']['TemperatureMessageTitle'];
    this.VM.Temperature=(localStorage.getItem("Temperature")!=""?parseFloat(localStorage.getItem("Temperature")):0.00);
    this.VM.HOSTIC=localStorage.getItem("HOSTIC");
    this.apiServices.SaveStaffTemperature({"HOSTIC":this.VM.HOSTIC,"Temperature":this.VM.Temperature}).subscribe((Status:any) => {
      if(Status!=undefined){
        if(Status[0].Status){
          let loData=JSON.parse(Status[0].Data);
          if(loData.Table[0].code=="S"){
            if(this.VM.Temperature>this.VM.MaxTemperature){
              const dialogRef = this.dialog.open(DialogAppCommonDialog, {
                disableClose:true,
                data: {"title": "Please contact administrator/reception?", "subTile":"Fever temperature not premitted to enter building",
                "enbCancel":false,"oktext":"Ok","canceltext":""}
              });
              dialogRef.afterClosed().subscribe(result => {
                this.router.navigateByUrl('/landing');
              });
            }
            else{
              const _this=this;
              this.timeOutCount = _timeout;
              this.RESULT_MSG = (this.KIOSK_PROPERTIES['General']['TemperatureMsg']).replace("{{timeOutCount}}",_timeout);
              setInterval(()=>{
                this.timeOutCount--;
                this.RESULT_MSG = (this.KIOSK_PROPERTIES['General']['TemperatureMsg']).replace("{{timeOutCount}}",this.timeOutCount);
              },1000);

              _timeout = parseInt(_timeout) * 1000;
              setTimeout(function(){
                _this.router.navigateByUrl('/landing');
              },_timeout);

            }
          }
          else{
            this.snackBar.open(loData.Table[0].description,"",{duration: 2000});
          }
        }
      }
    },err=>{});
  }
  ngOnDestroy() {
  }
  KIOSK_PROPERTIES:any = {};
  _updateKioskSettings(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES'); 
    if(setngs != undefined && setngs != ""){
      this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
    }
  }
}