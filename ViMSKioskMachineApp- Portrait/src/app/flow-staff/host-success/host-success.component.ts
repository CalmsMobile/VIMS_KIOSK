import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-host-success',
  templateUrl: './host-success.component.html',
  styleUrls: ['./host-success.component.scss']
})
export class HostSuccessComponent implements OnInit {
  sub:any;page:any;
  constructor(private router:Router, private route: ActivatedRoute,) { 
    setTimeout(()=>{
      this.router.navigateByUrl('/landing');
    },5000);
  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.page = params['page'] || "in";
      });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  takeActFor(action:string){
    if(action === "adminsettings"){
      //this.router.navigateByUrl('/visitorHostMobNumber')
    }else if(action === "dproceed"){
      this.router.navigateByUrl('/staffHostSuccess')
    }else if(action === "proceed"){
      this.router.navigateByUrl('/staffHostSuccess')
    }else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }

}
