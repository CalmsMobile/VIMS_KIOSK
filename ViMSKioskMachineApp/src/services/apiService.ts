import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from './app.settings';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';

const httpOptions = {
  headers: new HttpHeaders({
    // 'Content-Type':  'application/json',
    // 'Authorization': '',
    // 'Access-Control-Allow-Credentials':"true",
    // 'Access-Control-Allow-Methods':'POST, GET, OPTIONS, DELETE, PUT',
    // 'Access-Control-Allow-Origin':'*',
    // 'Accept':"'application/json"
  })
};
@Injectable()
export class ApiServices {
  isTest = false;
  constructor(public http: HttpClient, private datePipe: DatePipe, public myhttp: Http) {

  }
  public _getAPIURL(): string {
    let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
    if (_scanData != undefined && _scanData != "") {
      _scanData = JSON.parse(_scanData);
      if (_scanData['ApiUrl'] != undefined && _scanData['ApiUrl'] != "") {
        return _scanData['ApiUrl'];
      } else {
        return AppSettings['APP_API_SETUP']['api_url'];
      }
    } else {
      return AppSettings['APP_API_SETUP']['api_url'];
    }
  }
  public _postMethodAuth(data: any): any {
    let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
    _scanData = JSON.parse(_scanData);
    let MAC_ID = localStorage.getItem("MY_MAC_ID");
    let branch = localStorage.getItem(AppSettings.LOCAL_STORAGE.BRANCH_ID);

    data["Branch"] = branch,
      data["Authorize"] = {
        "AuMAppDevSeqId": _scanData['MAppSeqId'],
        "AuDeviceUID": MAC_ID ? MAC_ID : 'WEB',
        "Branch": branch,
        "RefBranchSeqId": branch
      }
    return data;
  }

  public _postMethodAuthNew(data: any, branchID): any {
    let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
    _scanData = JSON.parse(_scanData);
    let MAC_ID = localStorage.getItem("MY_MAC_ID");
    let branch = localStorage.getItem(AppSettings.LOCAL_STORAGE.BRANCH_ID);

    data["Branch"] = branch,
      data["Authorize"] = {
        "AuMAppDevSeqId": _scanData['MAppSeqId'],
        "AuDeviceUID": MAC_ID ? MAC_ID : 'WEB',
        "Branch":branch,
      },
      data["RefBranchSeqId"] = branchID 
    return data;
  }

  getMethod(serviceName: string, postData: any) {
    console.log("Inside get method");
    if (this.isTest)
      var URL = this._getAPIURL();
    else
      var URL = "http://localhost/Portal/api/kiosk/";

    console.log("URL", URL);
    console.log("serviceName", serviceName);

    if (postData) {
      postData = this._postMethodAuth(postData);
    }

    return this.http.get(URL + serviceName, postData);
  }
  localPostMethod(serviceName: string, postData: any) {
    let URL = this._getAPIURL();
    postData = this._postMethodAuth(postData);
    console.log("API URL: " + this._getAPIURL());
    console.log("API:" + serviceName + "----> Post Data: " + JSON.stringify(postData));
    return this.http.post(URL + AppSettings['APP_SERVICES'][serviceName], postData, httpOptions);
  }

  localPostMethodNew(serviceName: string, postData: any, branchID) {
    let URL = this._getAPIURL();
    postData = this._postMethodAuthNew(postData, branchID);
    console.log("API:" + serviceName + "----> Post Data: " + JSON.stringify(postData));
    return this.http.post(URL + AppSettings['APP_SERVICES'][serviceName], postData, httpOptions);
  }

  localGetMethod(serviceName: string, appendURL: string) {
    if(this.isTest)
    var URL = this._getAPIURL();
    else
    var URL = "http://localhost/Portal/";

    // let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
    // _scanData = JSON.parse(_scanData);
    // let MAC_ID = localStorage.getItem("MY_MAC_ID");

    // if(appendURL.indexOf('?') > -1){
    //   appendURL = appendURL + "&";
    // }else{
    //   appendURL = appendURL + "?";
    // }
    // appendURL = appendURL + "Authorize=" + JSON.stringify({
    //   "AuMAppDevSeqId":_scanData['MAppSeqId'],
    //   "AuDeviceUID":MAC_ID
    // });
    console.log("API:" + URL + AppSettings['APP_SERVICES'][serviceName] + appendURL);
    return this.http.get(URL + AppSettings['APP_SERVICES'][serviceName] + appendURL);
  }
  getApiDeviceConnectionRequest(service: string) {
    if(this.isTest)
    var URL = this._getAPIURL();
    else
    var URL = "http://localhost/Portal/";
    console.log(URL + service);
    return this.http.get(URL + service);
  }
  // getVisitorInfo(data:any)
  // {
  //   let URL = this._getAPIURL();
  //   let headers = new Headers(
  //     {
  //       // 'Content-Type': 'application/json',
  //       // 'Access-Control-Allow-Origin': '*',
  //       // 'Access-Control-Allow-Methods':'POST, GET, OPTIONS, DELETE, PUT',
  //       'content-type': 'application/json',
  //       'Accept': 'application/json',
  //       'Access-Control-Allow-Credentials':true,
  //       'Access-Control-Allow-Origin': '*',
  //     });
  //   let option = new RequestOptions({headers: headers });
  //   return this.myhttp.post(URL + AppSettings['APP_SERVICES']['getVisitorInfo'], data, option );
  // }

  getStaffInfo(data: any) {
    let URL = this._getAPIURL();
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['getStaffInfo'], data, httpOptions);
  }
  getStaffTemperature(data: any) {
    if(this.isTest)
    var URL = this._getAPIURL();
    else
    var URL = "http://localhost/Portal/";
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['getStaffTemperature'], data, httpOptions);
  }
  SaveStaffTemperature(data: any) {
    let URL = this._getAPIURL();
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['SaveStaffTemperature'], data, httpOptions);
  }

  getVisitorInfo(data: any) {
    let URL = this._getAPIURL();
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['getVisitorInfo'], data, httpOptions);
  }
  visitorIndividualCheckIn(data: any) {
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if (setngs != undefined && setngs != "") {
      const KIOSK_PROPERTIES = JSON.parse(setngs)['kioskSetup'];
      data.QRCodeField = KIOSK_PROPERTIES['modules']['printer']['qrRbar_print_field'];
    }
    let URL = this._getAPIURL();
    data.CurrentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['visitorIndividualCheckIn'], data, httpOptions);
  }
  visitorCheckOut(data: any) {
    let URL = this._getAPIURL();
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['visitorCheckOut'], data, httpOptions);
  }
  PrintVisitorLabel(data: any) {
    if(this.isTest)
    var URL = this._getAPIURL();
    else
    var URL = "http://localhost/Portal/";
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['PrintVisitorLabel'], data, httpOptions);
  }
  PrintVisitorReceipt(data: any) {
    if(this.isTest)
    var URL = this._getAPIURL();
    else
    var URL = "http://localhost/Portal/";
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['PrintVisitorReceipt'], data, httpOptions);
  }
  getPrintTemplateData(data: any) {
    let URL = this._getAPIURL();
    data = this._postMethodAuth(data);
    return this.http.post(URL + AppSettings['APP_SERVICES']['getTemplateData'], data, httpOptions);
  }

  getTermsAndConditions() {
    const htmlHeader = {
      headers: new HttpHeaders({
        'Content-Type': 'text/plain',
        //'Authorization': 'my-auth-token'
      })
    };
    return this.http.get("../assets/tandc.html", htmlHeader);
  }
  getKioskBalance(request) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', request.api, true);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          request.calBack(true, xmlhttp.responseText);
        } else {
          request.calBack(false);
        }
      } else {
        request.calBack(false);
      }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(request.data);
    return;
  }

  getConfigFile() {
    return this.http.get('assets/config.txt?time=' + new Date().getTime(), { responseType: 'text' });
  }

  // getVisitorInfo(request:any)
  // {
  //   function createCORSRequest(method, url) {
  //     var xhr = new XMLHttpRequest();
  //     if ("withCredentials" in xhr) {
  //       // XHR for Chrome/Firefox/Opera/Safari.
  //       xhr.open(method, url, true);

  //     }  else {
  //       // CORS not supported.
  //       xhr = null;
  //     }
  //     return xhr;
  //   }


  //   // Make the actual CORS request.
  //   function makeCorsRequest() {
  //     // This is a sample server that supports CORS.
  //     var url = AppSettings['APP_API_SETUP'][AppSettings['APP_DEFAULT_SETTIGS']['APP_TYPE']]['api_url'];
  //     //var url = 'http://localhost:85/api/Device/Printer';

  //     var xhr = createCORSRequest('POST', url);
  //     if (!xhr) {
  //       alert('CORS not supported');
  //       return;
  //     }

  //     // Response handlers.
  //     xhr.onload = function() {
  //       var text = xhr.responseText;
  //       console.log(text);
  //     };

  //     xhr.onerror = function() {
  //       alert('Woops, there was an error making the request.');
  //     };
  //     //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  //     xhr.setRequestHeader('Content-Type', 'application/json');
  //     xhr.send(JSON.stringify(request));
  //   }
  //   makeCorsRequest();
  // }
}
