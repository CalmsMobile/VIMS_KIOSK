import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogAppCommonDialog } from 'src/app/app.common.dialog';

@Component({
  selector: 'app-visitor-summary',
  templateUrl: './visitor-summary.component.html',
  styleUrls: ['./visitor-summary.component.scss']
})
export class VisitorSummaryComponent implements OnInit {
  totalVisitors:number = 0;
  listOFvisitors:any = [];
  constructor(private router:Router,
    public snackBar: MatSnackBar,
    private dialog:MatDialog) {
    let getVisi = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
    this.listOFvisitors = getVisi['visitorDetails'];
    this.totalVisitors = getVisi['visitorDetails'].length;
   }

  ngOnInit() {
  }
  takeActFor(action:string){
    if(action === "confirm"){
      if((this.listOFvisitors).length > 0){
        this.router.navigate(['/visitorMsgSuceess'],{queryParams:{action:"register"}});
      } else{
        this.takeActFor('addVisitor');
      }
    } else if(action === "back"){
      this.router.navigate(['/visitorAgree'],{queryParams:{needHostNumber:"no"}});
    } else if(action === "addVisitor"){
      if((this.listOFvisitors).length > 0){
        this.router.navigate(['/visitorAgree'],{queryParams:{needHostNumber:"no"}});
      } else{
        this.router.navigate(['/visitorAgree'],{queryParams:{needHostNumber:"yes"}});
      }
    } else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }
  deleteThisItem(index){
    const dialogRef = this.dialog.open(DialogAppCommonDialog, {
      //width: '250px',
      data: {"title": "Are you sure want to remove this visitor ?", "subTile":"",
      "enbCancel":true,"oktext":"Yes","canceltext":"No"}
    });
    dialogRef.afterClosed().subscribe(result => {
       if(result){
          let getVisi = JSON.parse(localStorage.getItem("VISI_LIST_ARRAY"));
          (this.listOFvisitors).splice(index,1);
          getVisi['visitorDetails'] = this.listOFvisitors;
          localStorage.setItem("VISI_LIST_ARRAY", JSON.stringify(getVisi));
          this.snackBar.open("Visitor removed from list", "", {duration: 2000});
       } else{

       }
    });
  }
}
