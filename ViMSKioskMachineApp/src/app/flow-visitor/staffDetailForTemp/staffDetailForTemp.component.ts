import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { AppSettings} from "../../../services/app.settings";
import {MatSnackBar, MatDialog} from '@angular/material';

@Component({
  selector: 'app-staffDetailForTemp',
  templateUrl: './staffDetailForTemp.component.html',
  styleUrls: ['./staffDetailForTemp.component.scss']
})
export class staffDetailForTempComponent implements OnInit {
  callTemperature:number=1;
 VM:any = {
   "HOSTNAME":"",
   "HOSTIC":"",
   "ServerTime":"",
   "ComPort":"",
   "WaitMessage":""
 }
  constructor(private router:Router,
    private apiServices:ApiServices,
    public snackBar: MatSnackBar,
    private dialog:MatDialog,
    private route: ActivatedRoute,) { 
      this._updateSettings(); 
  }
  _updateSettings(){
    this.VM.HOSTNAME = localStorage.getItem('HOSTNAME');
    this.VM.HOSTIC=localStorage.getItem('HOSTIC');
    this.VM.ServerTime=localStorage.getItem('ServerTime');
    this.VM.ComPort=localStorage.getItem('ComPort');
    this.VM.WaitMessage=localStorage.getItem('WaitMessage');
  }
  ngOnInit() {   
    this.getTemperature();
  }
  ngOnDestroy() {
    this.callTemperature=0;
  }
  getTemperature(){
    this.apiServices.getStaffTemperature({"ComPort":this.VM.ComPort}).subscribe((Status:any) => {
      if(Status!=undefined){
        if(Status[0].Status){
          let loData=JSON.parse(Status[0].Data);
          if((loData.ModbusStatus).indexOf("Error")==-1){
            if(loData.Temperature!=""){
              localStorage.setItem('Temperature',loData.Temperature);
              this.router.navigateByUrl('/staffTemperature');
            }
            else{
              if(this.callTemperature==1)
              this.getTemperature();
            }
          }
          else{
            this.snackBar.open(loData.ModbusStatus,"",{duration: 3000});
            this.router.navigateByUrl('/landing');
          }
        }
      }
    },err=>{});
  }
}
