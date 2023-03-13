import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DatePipe} from '@angular/common';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MatButtonModule, MatInputModule, MatDialogModule, MatSnackBarModule, MatFormFieldModule, MatBadgeModule} from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, DialogAppSessionTimeOutDialog } from './app.component';
import { DialogAppCommonDialog} from './app.common.dialog';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ApiServices} from '../services/apiService';
import {SettingsService} from '../services/settings.service';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TestingComponent } from './testing/testing.component';
import { FlowVisitorModule } from './flow-visitor/flow-visitor.module';
// import { FlowStaffModule } from './flow-staff/flow-staff.module';
import { LoginComponent } from './login/login.component';
import { GetkioskcodeComponent } from './getkioskcode/getkioskcode.component';
import { NgVirtualKeyboardModule } from '@protacon/ng-virtual-keyboard';
import { ScanqrcodeComponent } from './scanqrcode/scanqrcode.component';
import { QuestionnariesComponent } from './questionnaries/questionnaries.component';
import { MatVideoModule } from 'mat-video';
import { TermsComponent } from './flow-type50/terms/terms.component';
import { SuccessComponent } from './flow-type50/success/success.component';
import { ScanComponent } from './flow-type50/scan/scan.component';
import { MainPipeModule } from './main-pipe/main-pipe.module';
import { DetailsComponent, DialogSuccessMessagePage } from './flow-type50/details/details.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PageNotFoundComponent,
    TestingComponent,
    LoginComponent,
    DialogAppCommonDialog,
    DialogAppSessionTimeOutDialog,
    GetkioskcodeComponent,
    ScanqrcodeComponent,
    QuestionnariesComponent,
    TermsComponent,
    SuccessComponent,
    ScanComponent,
    DetailsComponent,
    DialogSuccessMessagePage
  ],
  imports: [
    HttpModule,
    FormsModule,
    NgQrScannerModule,
    HttpClientModule,
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatBadgeModule,
    AppRoutingModule,
    FlowVisitorModule,
    //FlowStaffModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NgVirtualKeyboardModule,
    MatVideoModule,
    MainPipeModule
 ],
  providers: [ApiServices, DatePipe , SettingsService],
  bootstrap: [AppComponent],

  entryComponents:[DialogAppCommonDialog,DialogAppSessionTimeOutDialog,DialogSuccessMessagePage]
})
export class AppModule { }
