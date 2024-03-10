import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { Routes, RouterModule } from '@angular/router';
import { FlowVisitorComponent, AppTermsAndCondtion, appConfirmDialog } from './flow-visitor.component';
import { HostMobileComponent, DialogMobileVerifyComponent } from './host-mobile/host-mobile.component';
import { RegistrationTypeComponent, DialogPrepareForScanComponent } from './registration-type/registration-type.component';
import { ScanRLoadingComponent } from './scan-rloading/scan-rloading.component';
import { AppointmentDetailComponent, BottomSheetPurposeSheet, DialogVisitorAlreadyExist, takeVisitorPictureDialog, BottomSheetCategorySelect, BottomSheetHostSelect, BottomSheetCountrySelect, BottomSheetGenderSelect, BottomSheetHoursSelect, BottomSheetBranchSelect } from './appointment-detail/appointment-detail.component';
import { AppointmentSuccessComponent, DialogSuccessMessagePage } from './appointment-success/appointment-success.component';
import { NgVirtualKeyboardModule } from '@protacon/ng-virtual-keyboard';
export const ROUTES: Routes = [
  { path: 'visitorAgree', component: FlowVisitorComponent },
  { path: 'visitorHostMobNumber', component: HostMobileComponent },
  { path: 'visitorRegisType', component: RegistrationTypeComponent },
  { path: 'visitorDocScanRLoading', component: ScanRLoadingComponent },
  { path: 'visitorAppointmentDetail', component: AppointmentDetailComponent },
  { path: 'visitorSummaryDetail', component: VisitorSummaryComponent },
  { path: 'visitorMsgSuceess', component: AppointmentSuccessComponent },
  { path: 'visitorPreApontmnt', component: VisitorPreApontmntComponent },
  { path: 'appointmentList', component: AppointmentListComponent },
  { path: 'visitorCheckout', component: VisitorCheckoutComponent },
  { path: 'checkoutSuccess', component: CheckoutSuccessComponent },
  { path: 'staffDetailForTemp', component: staffDetailForTempComponent },
  { path: 'visitorDetailForTemp', component: visitorDetailForTempComponent },
  { path: 'staffTemperature', component: staffTemperatureComponent },
  { path: 'visitorTemperature', component: visitorTemperatureComponent },
  { path: 'visitorTemperature', component: visitorTemperatureComponent },
  { path: 'barcode-verification', component: BarcodeVerificationComponent },
  { path: 'host-enrolment', component: HostEnrolmentComponent },
  { path: 'host-view', component: HostViewComponent },
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
  MatRippleModule,
  MatTabsModule
} from '@angular/material';
import { VisitorSummaryComponent } from './visitor-summary/visitor-summary.component';
import { MainPipeModule } from '../main-pipe/main-pipe.module';
import { VisitorPreApontmntComponent } from './visitor-pre-apontmnt/visitor-pre-apontmnt.component';
import { VisitorCheckoutComponent } from './visitor-checkout/visitor-checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { staffDetailForTempComponent } from './staffDetailForTemp/staffDetailForTemp.component';
import { staffTemperatureComponent } from './staffTemperature/staffTemperature.component';
import { visitorDetailForTempComponent } from './visitorDetailForTemp/visitorDetailForTemp.component';
import { visitorTemperatureComponent } from './visitorTemperature/visitorTemperature.component';
import { DialogAlertBox, DialogPrepareForScanComponent1 } from '../questionnaries/questionnaries.component';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { HostListComponent } from './host-list/host-list.component';
import { KeboardBottomSheetComponent } from './keboard-bottom-sheet/keboard-bottom-sheet.component';
import { UiSettingsComponent } from './ui-settings/ui-settings.component';
import { BarcodeVerificationComponent, DialogRetry } from './barcode-verification/barcode-verification.component';
import { EnterPinComponent } from './enter-pin/enter-pin.component';
import { HostEnrolmentComponent } from './host-enrolment/host-enrolment.component';
import { HostViewComponent, takeHostPictureDialog } from './host-view/host-view.component';

@NgModule({
  declarations: [FlowVisitorComponent, HostMobileComponent, DialogMobileVerifyComponent,
    RegistrationTypeComponent, DialogPrepareForScanComponent, DialogPrepareForScanComponent1,
    ScanRLoadingComponent, AppTermsAndCondtion, DialogAlertBox, BottomSheetHoursSelect,
    AppointmentDetailComponent, BottomSheetPurposeSheet, BottomSheetBranchSelect, DialogVisitorAlreadyExist, takeVisitorPictureDialog,takeHostPictureDialog,
    AppointmentSuccessComponent, DialogSuccessMessagePage, VisitorSummaryComponent, appConfirmDialog,
    VisitorPreApontmntComponent, VisitorCheckoutComponent, CheckoutSuccessComponent, BottomSheetCategorySelect, BottomSheetHostSelect, staffDetailForTempComponent,
    staffTemperatureComponent, visitorDetailForTempComponent, visitorTemperatureComponent, BottomSheetCountrySelect, BottomSheetGenderSelect, AppointmentListComponent, HostListComponent, KeboardBottomSheetComponent, UiSettingsComponent, BarcodeVerificationComponent, DialogRetry, EnterPinComponent, HostEnrolmentComponent, HostViewComponent],
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
    MatTabsModule,
    NgVirtualKeyboardModule,
    MainPipeModule,
    WebcamModule
  ],
  entryComponents: [
    BottomSheetPurposeSheet, BottomSheetBranchSelect, BottomSheetCategorySelect, BottomSheetHostSelect, BottomSheetCountrySelect,
    BottomSheetGenderSelect,
    BottomSheetHoursSelect,
    DialogAlertBox,
    DialogVisitorAlreadyExist, takeVisitorPictureDialog,takeHostPictureDialog,
    DialogMobileVerifyComponent,
    DialogPrepareForScanComponent,
    DialogPrepareForScanComponent1,
    DialogSuccessMessagePage,
    AppTermsAndCondtion,
    appConfirmDialog,
    DialogRetry
  ],
})
export class FlowVisitorModule { }
