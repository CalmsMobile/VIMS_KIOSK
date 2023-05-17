import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServices } from 'src/services/apiService';
import { appConfirmDialog } from '../flow-visitor.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  totalVisitors: number = 0;
  listOFAppointments: any = [];
  purposes = [];
  constructor(private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private apiServices: ApiServices,
    private datePipe: DatePipe,
    private dialog: MatDialog) { }

  ngOnInit() {
    if (localStorage.getItem('_PURPOSE_OF_VISIT') != undefined && localStorage.getItem('_PURPOSE_OF_VISIT') != '') {
      this.purposes = JSON.parse(localStorage.getItem('_PURPOSE_OF_VISIT'));
    }
    this._getAllPurposeOfVisit();
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        const passData = params['data'];
        console.log(JSON.stringify(passData));
        if (passData != undefined && passData.length > 0) {
          const list = JSON.parse(passData);
          list.forEach(element => {
            element.START_TIME = this.datePipe.transform(element.START_TIME, 'EEEE, MMMM d, y, h:mm a');
            element.END_TIME = this.datePipe.transform(element.END_TIME, 'EEEE, MMMM d, y, h:mm a');
            if (element.purpose) {
              //element.START_TIME = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
              //element.END_TIME = this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
              element.purposeDesc = this.getPurposeName(element.purpose, false);
              element.purposeId = this.getPurposeName(element.purpose, true);
            }
          });
          this.listOFAppointments = list;
          console.log(this.listOFAppointments);
        }
      });
  }

  _getAllPurposeOfVisit() {
    this.apiServices.localPostMethod('getPurpose', {}).subscribe((data: any) => {
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        this.purposes = JSON.parse(data[0]["Data"]);
        localStorage.setItem('_PURPOSE_OF_VISIT', data[0]["Data"]);
        console.log("--- Purpose of Visit Updated");
      }
    },
      err => {
        console.log("Failed...");
        return false;
      });
  }

  getPurposeName(purposeId, isID) {
    let purposeTitle = purposeId;
    console.log(this.purposes);
    this.purposes.forEach(element => {
      if (element.visitpurpose_desc == purposeId || element.visitpurpose_id == purposeId) {
        if (isID) {
          purposeTitle = element.visitpurpose_id;
        } else {
          purposeTitle = element.visitpurpose_desc;
        }

        return purposeTitle;
      }
    });
    return purposeTitle
  }

  takeActFor(action: string, appointments) {
    if (action === "confirm") {
      if ((this.listOFAppointments).length > 0) {
        if (appointments['AllowedVisits'] > 0) {
          if (appointments['UsedCount'] > 0 && appointments['AllowedVisits'] <= appointments['UsedCount']) {
            //<Message> = "The maximum number of check-ins for this appointment has been reached, so you won't be able to check-in using this appointment. Please contact host or reception desk for further assistance.";  
            this.dialog.open(appConfirmDialog, {
              width: '250px',
              data: { title: "The maximum number of check-ins for this appointment has been reached, so you won't be able to check-in using this appointment. Please contact host or reception desk for further assistance.", btn_ok: "Ok" }
            });
          }else {
            appointments['aptid'] = appointments.ApptmentId.toString();
            localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(appointments));
            this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });
          }
        } else {
          appointments['aptid'] = appointments.ApptmentId.toString();
          localStorage.setItem("VISI_SCAN_DOC_DATA", JSON.stringify(appointments));
          this.router.navigate(['/visitorAppointmentDetail'], { queryParams: { docType: "PREAPPOINTMT" } });
        }
      }
    } else if (action === "back") {
      this.router.navigate(['/visitorPreApontmnt'], { queryParams: { needHostNumber: "no" } });
    } else if (action === "home") {
      this.router.navigateByUrl('/landing')
    }
  }

}
