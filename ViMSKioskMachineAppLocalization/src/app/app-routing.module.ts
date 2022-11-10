import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AppComponent } from './app.component';
import { TestingComponent } from './testing/testing.component';
import { GetkioskcodeComponent } from './getkioskcode/getkioskcode.component';
import { ScanqrcodeComponent } from './scanqrcode/scanqrcode.component';
import { QuestionnariesComponent } from './questionnaries/questionnaries.component';

const routes: Routes = [
   {path: '', component: LandingComponent},
   {path: 'visitorAgree', redirectTo: "../flow-visitor/flow-visitor.module#FlowVisitorModule"},
   //{path: 'staffFlow', redirectTo: "../flow-staff/flow-staff.module#FlowStaffModule"},
   {path: 'landing', component: LandingComponent},
   {path: 'getKioskCode', component: GetkioskcodeComponent},
   {path: 'scanQRCode', component: ScanqrcodeComponent},
   {path: 'testing', component: TestingComponent},
   {path: 'questionarie', component: QuestionnariesComponent},

   //{path: '**', component: LandingComponent},
  // {
  //   path: '', 
  //   component: LandingComponent, 
  //   children: [
  //     {path: '**', component: LandingComponent},
      
  //     {path: 'slidermanager', redirectTo: "./slidermanager/slidermanager.module#SlidermanagerModule"}
  //   ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
