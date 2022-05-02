import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import {MatSnackBar, MatDialog} from '@angular/material';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';

@Component({
  selector: 'app-visitorTemperature',
  templateUrl: './visitorTemperature.component.html',
  styleUrls: ['./visitorTemperature.component.scss']
})
export class visitorTemperatureComponent implements OnInit {
  VM:any = {
   "Temperature":"",
   "TempTitle":"",
   "MaxTemperature":37.00
  }
  KIOSK_PROPERTIES: any;
  constructor(private router:Router,
    private apiServices:ApiServices,
    public snackBar: MatSnackBar,
    private dialog:MatDialog,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.VM.TempTitle=localStorage.getItem("TemperatureMessageTitle");
    this.VM.Temperature=(localStorage.getItem("Temperature")!=""?parseFloat(localStorage.getItem("Temperature")):0.00);
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
      let setngs = localStorage.getItem('KIOSK_PROPERTIES');
      if(setngs != undefined && setngs != ""){
        this.KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      }
      setTimeout(() => {
        this.router.navigateByUrl('/landing');
      }, 2000);
    }
  }
  ngOnDestroy() {
  }
}
