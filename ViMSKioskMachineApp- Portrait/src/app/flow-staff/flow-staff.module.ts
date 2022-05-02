import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlowStaffComponent } from './flow-staff.component';
import { HostotpComponent } from './hostotp/hostotp.component';
import { AppointmentDetailComponent, DialogStaffActionAlerts } from './appointment-detail/appointment-detail.component';
import { HostSuccessComponent } from './host-success/host-success.component';
import { NgVirtualKeyboardModule }  from '@protacon/ng-virtual-keyboard';
export const ROUTES: Routes = [
  { path: 'staffFlow', component: FlowStaffComponent }, 
  { path: 'staffHostOtp', component: HostotpComponent }, 
  { path: 'staffAptmDetail', component: AppointmentDetailComponent }, 
  { path: 'staffHostSuccess', component: HostSuccessComponent }, 
  { path: 'staffHostSsettings', component: SettingsComponent }, 
];
import { 
  MatToolbarModule,
  MatInputModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatRadioModule,
  MatBadgeModule,
  MatDialogModule
} from '@angular/material';
import { SettingsComponent } from './settings/settings.component';
@NgModule({
  declarations: [FlowStaffComponent, HostotpComponent, AppointmentDetailComponent, DialogStaffActionAlerts,
     HostSuccessComponent, SettingsComponent],
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatCardModule,
    MatBadgeModule,
    MatRadioModule,
    MatDialogModule,
    NgVirtualKeyboardModule
  ],
  entryComponents:[DialogStaffActionAlerts]
})
export class FlowStaffModule { }
