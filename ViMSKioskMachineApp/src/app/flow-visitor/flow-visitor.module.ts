import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { WebcamModule} from 'ngx-webcam';
import { Routes, RouterModule } from '@angular/router';
import { FlowVisitorComponent, AppTermsAndCondtion, appConfirmDialog } from './flow-visitor.component';
import { HostMobileComponent, DialogMobileVerifyComponent } from './host-mobile/host-mobile.component';
import { RegistrationTypeComponent, DialogPrepareForScanComponent } from './registration-type/registration-type.component';
import { ScanRLoadingComponent } from './scan-rloading/scan-rloading.component';
import { AppointmentDetailComponent, BottomSheetPurposeSheet, DialogVisitorAlreadyExist, takeVisitorPictureDialog, BottomSheetCategorySelect, BottomSheetHostSelect, BottomSheetCountrySelect, BottomSheetGenderSelect } from './appointment-detail/appointment-detail.component';
import { AppointmentSuccessComponent, DialogSuccessMessagePage } from './appointment-success/appointment-success.component';
import { NgVirtualKeyboardModule }  from '@protacon/ng-virtual-keyboard';
export const ROUTES: Routes = [
  { path: 'visitorAgree', component: FlowVisitorComponent },
  { path: 'visitorHostMobNumber', component: HostMobileComponent },
  { path: 'visitorRegisType', component: RegistrationTypeComponent },
  { path: 'visitorDocScanRLoading', component: ScanRLoadingComponent },
  { path: 'visitorAppointmentDetail', component: AppointmentDetailComponent },
  { path: 'visitorSummaryDetail', component: VisitorSummaryComponent },
  { path: 'visitorMsgSuceess', component: AppointmentSuccessComponent },
  { path: 'visitorPreApontmnt', component: VisitorPreApontmntComponent },
  { path: 'staffDetailForTemp', component: staffDetailForTempComponent },
  { path: 'visitorDetailForTemp', component: visitorDetailForTempComponent },
  { path: 'staffTemperature', component: staffTemperatureComponent },
  { path: 'visitorTemperature', component: visitorTemperatureComponent },
];
import {
  MatToolbarModule,
  MatInputModule,
  MatBadgeModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatRadioModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatRippleModule
} from '@angular/material';
import { VisitorSummaryComponent } from './visitor-summary/visitor-summary.component';
import { MainPipeModule } from '../main-pipe/main-pipe.module';
import { VisitorPreApontmntComponent } from './visitor-pre-apontmnt/visitor-pre-apontmnt.component';
import { staffDetailForTempComponent } from './staffDetailForTemp/staffDetailForTemp.component';
import { staffTemperatureComponent } from './staffTemperature/staffTemperature.component';
import { visitorDetailForTempComponent } from './visitorDetailForTemp/visitorDetailForTemp.component';
import { visitorTemperatureComponent } from './visitorTemperature/visitorTemperature.component';
import { DialogPrepareForScanComponent1 } from '../questionnaries/questionnaries.component';

@NgModule({
  declarations: [FlowVisitorComponent, HostMobileComponent, DialogMobileVerifyComponent,
     RegistrationTypeComponent, DialogPrepareForScanComponent, DialogPrepareForScanComponent1,
      ScanRLoadingComponent,AppTermsAndCondtion,
      AppointmentDetailComponent, BottomSheetPurposeSheet, DialogVisitorAlreadyExist, takeVisitorPictureDialog,
      AppointmentSuccessComponent,DialogSuccessMessagePage, VisitorSummaryComponent, appConfirmDialog,
      VisitorPreApontmntComponent, BottomSheetCategorySelect, BottomSheetHostSelect, staffDetailForTempComponent,
    staffTemperatureComponent,visitorDetailForTempComponent,visitorTemperatureComponent,BottomSheetCountrySelect, BottomSheetGenderSelect],
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatCardModule,
    MatRadioModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatRippleModule,
    NgVirtualKeyboardModule,
    MainPipeModule,
    WebcamModule
  ],
  entryComponents: [
    BottomSheetPurposeSheet,BottomSheetCategorySelect, BottomSheetHostSelect, BottomSheetCountrySelect,
    BottomSheetGenderSelect,
    DialogVisitorAlreadyExist,takeVisitorPictureDialog,
    DialogMobileVerifyComponent,
    DialogPrepareForScanComponent,
    DialogPrepareForScanComponent1,
    DialogSuccessMessagePage,
    AppTermsAndCondtion,
    appConfirmDialog
  ],
})
export class FlowVisitorModule { }
