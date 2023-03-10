import { DetailsContractorStaffComponent } from './flow-type50/details-contractor-staff/details-contractor-staff.component';
import { DetailsContractorComponent } from './flow-type50/details-contractor/details-contractor.component';
import { DetailsVendorComponent } from './flow-type50/details-vendor/details-vendor.component';
import { DetailsVisitorComponent } from './flow-type50/details-visitor/details-visitor.component';
import { ScanComponent } from './flow-type50/scan/scan.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AppComponent } from './app.component';
import { TestingComponent } from './testing/testing.component';
import { GetkioskcodeComponent } from './getkioskcode/getkioskcode.component';
import { ScanqrcodeComponent } from './scanqrcode/scanqrcode.component';
import { QuestionnariesComponent } from './questionnaries/questionnaries.component';
import { TermsComponent } from './flow-type50/terms/terms.component';
import { SuccessComponent } from './flow-type50/success/success.component';

const routes: Routes = [
   {path: '', component: LandingComponent},
   {path: 'visitorAgree', redirectTo: "../flow-visitor/flow-visitor.module#FlowVisitorModule"},
   //{path: 'staffFlow', redirectTo: "../flow-staff/flow-staff.module#FlowStaffModule"},
   {path: 'landing', component: LandingComponent},
   {path: 'getKioskCode', component: GetkioskcodeComponent},
   {path: 'scanQRCode', component: ScanqrcodeComponent},
   {path: 'testing', component: TestingComponent},
   {path: 'questionarie', component: QuestionnariesComponent},
   {path: 'terms',component:TermsComponent},
   {path: 'scan',component:ScanComponent},
   {path: 'success',component:SuccessComponent},
   {path: 'detailsVisitor',component:DetailsVisitorComponent},
   {path: 'detailsVendor',component:DetailsVendorComponent},
   {path: 'detailsContractor',component:DetailsContractorComponent},
   {path: 'detailsContractorStaff',component:DetailsContractorStaffComponent},

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
