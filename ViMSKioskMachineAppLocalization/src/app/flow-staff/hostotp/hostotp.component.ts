import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hostotp',
  templateUrl: './hostotp.component.html',
  styleUrls: ['./hostotp.component.scss']
})
export class HostotpComponent implements OnInit {
 sub:any;page:any;
 HOST_OTP_PIN:any;
 LOGO_IMG = "assets/images/cus_icons/smartphone.png";
  constructor(private router:Router, private route: ActivatedRoute) { 
    this.HOST_OTP_PIN = '';
  }
  
  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.page = params['page'] || "in";
        console.log(this.page);
      });
  }
  takeActFor(action:string){
    if(action === "next"){
      if((this.HOST_OTP_PIN).toString().length == 6)
      this.router.navigate(['/staffAptmDetail'],{ queryParams: { page: this.page, otp: this.HOST_OTP_PIN }});
    }else if(action === "back"){
      this.router.navigateByUrl('/staffFlow')
    }else if(action === "home"){
      this.router.navigateByUrl('/landing')
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  textDataBindTemp(value : string, elm:string ) {  
    console.log(value);
    this[elm] = value;
  }
}
