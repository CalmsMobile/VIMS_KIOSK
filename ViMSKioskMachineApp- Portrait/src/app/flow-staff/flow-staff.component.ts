import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flow-staff',
  templateUrl: './flow-staff.component.html',
  styleUrls: ['./flow-staff.component.scss']
})
export class FlowStaffComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  takeActFor(action:string){
    if(action === "adminsettings"){
      this.router.navigateByUrl('/staffHostSsettings')
    }else if(action === "signIn"){
      this.router.navigate(['/staffHostOtp'],{ queryParams: { page: "in" }})
    }else if(action === "signOut"){
      this.router.navigate(['/staffHostOtp'],{ queryParams: { page: "out" }})
    }else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }
}
