import { element } from 'protractor';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { ApiServices } from 'src/services/apiService';

@Component({
  selector: 'app-host-list',
  templateUrl: './host-list.component.html',
  styleUrls: ['./host-list.component.scss']
})
export class HostListComponent implements OnInit {
  host_list: any;
  host_listClone: any;
  searchText: string = '';
  KIOSK_PROPERTIES: any;
  KIOSK_PROPERTIES_LOCAL: any = {};
  searchHostOption: false;
  constructor(private bottomSheetRef: MatBottomSheetRef<HostListComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private apiServices: ApiServices) {
    this.KIOSK_PROPERTIES = data.data;
    this.host_list = [];
    this.host_listClone = [];
    /* let setngs_local = localStorage.getItem('KIOSK_PROPERTIES_LOCAL');
    this.KIOSK_PROPERTIES_LOCAL = JSON.parse(setngs_local);
      if (this.KIOSK_PROPERTIES_LOCAL) {
        this.searchHostOption = this.KIOSK_PROPERTIES_LOCAL.searchHostOption;
      } */
    if (this.KIOSK_PROPERTIES.COMMON_CONFIG.Enable_visitor_search_host != undefined) {
      this.searchHostOption = this.KIOSK_PROPERTIES.COMMON_CONFIG.Enable_visitor_search_host;
    }
   /*  if (data.showMultiBranch) {
      this._getAllHostListNew(data.branchID);
    } else {
      this._getAllHostList();
    } */
    if (localStorage.getItem('_LIST_OF_HOST') != undefined && localStorage.getItem('_LIST_OF_HOST') != '') {
      // this.host_list = JSON.parse(localStorage.getItem('_LIST_OF_HOST'));
      this.host_listClone = JSON.parse(localStorage.getItem('_LIST_OF_HOST'));
      this.host_list = this.host_listClone;
      document.getElementById("bodyloader").style.display = "none";
    }

  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    console.log(document.getElementsByClassName('cdk-overlay-pane'));
    let element =document.getElementsByClassName('cdk-overlay-pane');

  }

  textDataBindTemp(value: string, elm: string) {
    console.log(value);
    // this.searchText = value;
  }

  onKey(value: string, event: any) {
    console.log("onKey: " + value);
    console.log(JSON.stringify(event));
    this.searchText = value;
    if (this.host_listClone && this.host_listClone.length > 0 && this.searchText.length > 0) {
      var final = [];
      for (let i = 0; i < this.host_listClone.length; i++) {
        var data = this.host_listClone[i];
        if (data.HOSTNAME && this.searchText && data.HOSTNAME.toLowerCase().lastIndexOf(this.searchText.toLowerCase()) > -1) {
          final.push(data);
        }
      }
      this.host_list = final;
      console.log(final)
    } else {
      this.host_list = final;
    }
  }
search(){
  this.bottomSheetRef.dismiss("search");
   // event.preventDefault();
}
  selectThisItem(event: MouseEvent, purpose: any): void {
    this.bottomSheetRef.dismiss(purpose);
    event.preventDefault();
  }
  _getAllHostList() {
    this.apiServices.localPostMethod('getHostName', {}).subscribe((data: any) => {
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        // this.host_list = JSON.parse(data[0]["Data"]);
        this.host_listClone = JSON.parse(data[0]["Data"]);
        this.host_list = this.host_listClone;
        localStorage.setItem('_LIST_OF_HOST', data[0]["Data"]);
        //{"HOSTNAME":"awang","SEQID":225,"COMPANY_REFID":"1","DEPARTMENT_REFID":"","HOSTIC":"awang","HostExt":"","HostFloor":"","HostCardSerialNo":"","HOST_ID":"awang","HOST_EMAIL":"","EMAIL_ALERT":true,"AD_ACTIVE_USER_STATUS":true,"dept_id":null,"dept_desc":null}
        console.log("--- List Of Host Updated " + JSON.stringify(data[0]["Data"]));
      }
    },
      err => {
        console.log("Failed...");
        return false;
      });
  }
  _getAllHostListNew(branchID) {
    this.apiServices.localPostMethodNew('getHostName', {}, branchID).subscribe((data: any) => {
      if (data.length > 0 && data[0]["Status"] === true && data[0]["Data"] != undefined) {
        // this.host_list = JSON.parse(data[0]["Data"]);
        this.host_listClone = JSON.parse(data[0]["Data"]);
        this.host_list = this.host_listClone;
        localStorage.setItem('_LIST_OF_HOST', data[0]["Data"]);
        //{"HOSTNAME":"awang","SEQID":225,"COMPANY_REFID":"1","DEPARTMENT_REFID":"","HOSTIC":"awang","HostExt":"","HostFloor":"","HostCardSerialNo":"","HOST_ID":"awang","HOST_EMAIL":"","EMAIL_ALERT":true,"AD_ACTIVE_USER_STATUS":true,"dept_id":null,"dept_desc":null}
        console.log("--- List Of Host Updated multibranch " + JSON.stringify(data[0]["Data"]));
      }
    },
      err => {
        console.log("Failed...");
        return false;
      });
  }

}
