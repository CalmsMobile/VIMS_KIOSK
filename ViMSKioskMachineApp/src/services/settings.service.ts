import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings} from './app.settings';
import { Http } from '@angular/http';
import { ApiServices } from './apiService';
import { MatSnackBar, MatDialog } from '@angular/material';
import { DialogAppCommonDialog } from '../app/app.common.dialog';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SettingsService {
  public MAC_ID:string = ""
  APP_KIOSK_CODE_DECRIPTED:any = {};
  MSG_STRING:any = {
    "NEW_LICENSE":"Valid license",
    "NEW_LICENSE_SUB":"Are you sure want to register this device?",
    "EXIST_LICENSE":"License Already Mapped",
    "EXIST_LICENSE_SUB":"This license already mapped with one device, Are you sure want to update this license?",
    "EXIST_DEVICE":"Device Already Mapped",
    "EXIST_DEVICE_SUB":"This device already mapped with one license, Are you sure want to update this device?",
    "INVALID_LICENSE":"Invalid license",
    "INVALID_LICENSE_SUB":"",
    "UNAUTH_CALL":"Un Authendicated Device",
    "UNAUTH_CALL_SUB":""
  }
  constructor(
      public http: HttpClient,
      public myhttp:Http,
      private apiServices:ApiServices,
     public snackBar: MatSnackBar,
     private dialog:MatDialog) {
  }
  public _verifyKioskMachineCode(_callBack:any){
    if(localStorage.getItem("APP_KIOSK_CODE") != undefined && localStorage.getItem("APP_KIOSK_CODE") != ""){
      try {
        let _scanData:any = this._decrypt(localStorage.getItem("APP_KIOSK_CODE"));
        localStorage.setItem("APP_KIOSK_CODE_DECRIPTED", _scanData);
        this.APP_KIOSK_CODE_DECRIPTED = JSON.parse(_scanData);
        if(this.APP_KIOSK_CODE_DECRIPTED["MAppId"] != undefined && this.APP_KIOSK_CODE_DECRIPTED["MAppId"] === "KIOSK"){
          this.apiServices.localGetMethod("GetMACAddress","").subscribe((data:any) => {
            let MacDetails = data;
            if(MacDetails.length > 0 && MacDetails[0]['Status'] === true){
              this.MAC_ID = MacDetails[0]['Data'];
              localStorage.setItem("MY_MAC_ID",this.MAC_ID);
              let _prepare = {
                "MAppDevSeqId":this.APP_KIOSK_CODE_DECRIPTED['MAppSeqId'],
                "DeviceMacID":this.MAC_ID
              }
              this.apiServices.localPostMethod("GetKIOSKDeviceInfo",_prepare).subscribe((data:any) => {
                if(data.length > 0 && data[0]['Status'] === true){
                  let _details = JSON.parse(data[0]['Data']);
                  console.log(_details);
                  if(_details['Table'] != undefined && _details['Table'].length > 0
                  && _details['Table'][0]['Code'] == 10){
                    localStorage.setItem(AppSettings.LOCAL_STORAGE.BRANCH_ID, _details['Table1'][0]['RefBranchSeqid'] ? _details['Table1'][0]['RefBranchSeqid']: _details['Table1'][0]['RefBranchSeqId']);
                    if(_details['Table2'] != undefined && _details['Table2'].length > 0){
                      console.log(_details['Table2']);
                      if(_details['Table2'][0]['DeviceUID'] != undefined && _details['Table2'][0]['DeviceUID'] != null
                        && _details['Table2'][0]['DeviceUID'] != "" && _details['Table2'][0]['DeviceUID'] == this.MAC_ID){
                          document.getElementById("bodyloader").style.display = "none";
                          this.dialog.open(DialogAppCommonDialog, {
                            width: '250px',
                            disableClose:true,
                            data: {title: this.MSG_STRING.EXIST_DEVICE, subTile:this.MSG_STRING.EXIST_DEVICE_SUB, enbCancel:true, canceltext:"Cancel", oktext:"Ok"}
                          }).afterClosed().subscribe(result => {
                            if(result){
                              document.getElementById("bodyloader").style.display = "block";
                              this._updateThisLicence(_callBack);
                            } else{
                              document.getElementById("bodyloader").style.display = "none";
                            }
                        });
                      } else{
                        _callBack(false);
                        return false;
                      }
                    } else {
                      if(_details['Table1'] != undefined && _details['Table1'].length > 0){
                        if(_details['Table1'][0]['DeviceUID'] == undefined || _details['Table1'][0]['DeviceUID'] == null
                          || _details['Table1'][0]['DeviceUID'] == ""){
                            document.getElementById("bodyloader").style.display = "none";
                            this.dialog.open(DialogAppCommonDialog, {
                              width: '250px',
                              data: {title: this.MSG_STRING.NEW_LICENSE, subTile:this.MSG_STRING.NEW_LICENSE_SUB, enbCancel:true, canceltext:"Cancel", oktext:"Ok"}
                            }).afterClosed().subscribe(result => {
                              if(result){
                                document.getElementById("bodyloader").style.display = "block";
                                this._updateThisLicence(_callBack);
                              } else{
                                document.getElementById("bodyloader").style.display = "none";
                              }
                          });
                        } else if(_details['Table1'][0]['DeviceUID'] != this.MAC_ID){
                          document.getElementById("bodyloader").style.display = "none";
                          this.dialog.open(DialogAppCommonDialog, {
                            width: '250px',
                            disableClose:true,
                            data: {title: this.MSG_STRING.EXIST_LICENSE, subTile:this.MSG_STRING.EXIST_LICENSE_SUB, enbCancel:true, canceltext:"Cancel", oktext:"Ok"}
                          }).afterClosed().subscribe(result => {
                            if(result){
                              document.getElementById("bodyloader").style.display = "block";
                              this._updateThisLicence(_callBack);
                            } else{
                              document.getElementById("bodyloader").style.display = "none";
                            }
                          });
                        } else if(_details['Table1'][0]['DeviceUID'] == this.MAC_ID){
                          this._getThisLicenceSetupProperties(_callBack);
                        }
                      } else {
                        _callBack(false);
                        return false;
                      }
                    }
                  } else{
                    _callBack(false);
                    return false;
                  }
                }
              },
              err => {
                _callBack(false);
                return false;
              });
            }
          },
          err => {
            _callBack(false);
            return false;
          });
        } else{
          document.getElementById("bodyloader").style.display = "none";
          this.dialog.open(DialogAppCommonDialog, {
            width: '250px',
            disableClose:true,
            data: {title: this.MSG_STRING.INVALID_LICENSE, subTile:this.MSG_STRING.INVALID_LICENSE_SUB,
               enbCancel:false, canceltext:"Cancel", oktext:"Ok"}
          });
        }
      } catch(e){
        _callBack(false);
        return false;
      }
      //{"MAppId":"KIOSK","MAppSeqId":"201","ApiUrl":"http://localhost:2019/"}
    }
  }
  public _updateThisLicence(_callBack:any){
    let _prepare = {
      "MAppDevSeqId":this.APP_KIOSK_CODE_DECRIPTED['MAppSeqId'],
      "PushNotificationId":"1",
      "DeviceMacID":this.MAC_ID,
      "DevicePlatform":"Windows Kiosk",
      "DeviceDetails":"Windows Kiosk"
    }
    this.apiServices.localPostMethod("SaveKIOSKDeviceInfo",_prepare).subscribe((data:any) => {
      if(data.length > 0 && data[0]['Status'] === true){
        let _details = JSON.parse(data[0]['Data']);
        if(_details['Table'] != undefined && _details['Table'].length > 0
        && _details['Table'][0]['Code'] == 10){
          if(_details['Table1'] != undefined && _details['Table1'].length > 0){
            console.log("asdasdasda" + JSON.stringify(_details['Table1']));
          }
          this._getThisLicenceSetupProperties(_callBack);
        }else{
          _callBack(false);
          return false;
        }
      } else{
        _callBack(false);
        return false;
      }
    },
    err => {
      _callBack(false);
      return false;
    });
  }
  public _getThisLicenceSetupProperties(_callBack:any){

    let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
    this.APP_KIOSK_CODE_DECRIPTED = JSON.parse(_scanData);
    this.MAC_ID = localStorage.getItem("MY_MAC_ID");
    let _prepare = {
      "MAppDevSeqId":this.APP_KIOSK_CODE_DECRIPTED['MAppSeqId'],
      "Authorize":{
        "AuMAppDevSeqId":this.APP_KIOSK_CODE_DECRIPTED['MAppSeqId'],
        "AuDeviceUID":this.MAC_ID
      }
    }
    this.apiServices.localPostMethod("GetKIOSKSettings",_prepare).subscribe((data:any) => {
      console.log(data);
      if(data.length > 0 && data[0]['Status'] === true){
        let _details = JSON.parse(data[0]['Data']);
        if(_details['Table'] != undefined && _details['Table'].length > 0
        && _details['Table'][0]['Code'] == 10){
          if(_details['Table1'] != undefined && _details['Table1'].length > 0){
            let _kiosk_info = _details['Table1'][0];
            let _prepare = {
              "kioskName":"",
              "kioskAvalCards":_kiosk_info['kioskAvalCards'],
              "kioskSetup": JSON.parse(_kiosk_info['SettingDetail']),
              "IsKeyMansIdValidate": _kiosk_info.IsKeyMansIdValidate
            }
            if(_details['Table2'] != undefined && _details['Table2'].length > 0){
              _prepare['kioskName'] = _details['Table2'][0]['Name'];
            }
console.log("KIOSK_PROPERTIES "+ JSON.stringify(_prepare));
            localStorage.setItem('KIOSK_PROPERTIES', JSON.stringify(_prepare));

            this._initCardDispenserModule();
            //this.snackBar.open("Kiosk Properties Updated !","",{duration: 2000});
            _callBack(true);
            return true;
          } else{
            _callBack(false);
            return false;
          }
        } else{
          _callBack(false);
          return false;
        }
      } else{
        _callBack(false);
        return false;
      }
    },
    err => {
      _callBack(false);
      return false;
    });
  }
  public _initCardDispenserModule(){
    let setngs = localStorage.getItem('KIOSK_PROPERTIES');
    if(setngs != undefined && setngs != ""){
      setngs = JSON.parse(setngs)['kioskSetup'];
    }
    let _cardDenable = setngs['modules']['card_dispenser']['enable'] || false;
    let _cardDtype = setngs['modules']['card_dispenser']['dispenser_type'] || "";
    let _cardDcom = setngs['modules']['card_dispenser']['COM_Port'] || "";
    let _cardDStatus = {
      "type":_cardDtype,
      "enable":_cardDenable,
      "COM":_cardDcom,
      "open": {"ResponseStatus":"","ResponseMessage":""},
      "close": {"ResponseStatus":"","ResponseMessage":""},
      "init": {"ResponseStatus":"","ResponseMessage":""},
      "status": {"ResponseStatus":"","ResponseMessage":""},
      "cardserial": {"ResponseStatus":"","ResponseMessage":""},
    }
    localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
    if(_cardDenable){
      if(_cardDtype === 'TYPE2'){
        // ---------- Call Card Dispenser COM Close ----------
        this.apiServices.localGetMethod("SD_CloseCOM","").subscribe((data:any) => {
          if(data.length > 0 && data[0]['Data'] != ""){
            let _closeCardD = JSON.parse(data[0]['Data']) || {"ResponseStatus":"1","ResponseMessage":"Invalid JSON"};
            _cardDStatus.close = _closeCardD;
            if(_closeCardD['ResponseStatus'] === "0" || _closeCardD['ResponseStatus'] === "1"){
              // ---------- Call Card Dispenser COM Open ----------
              this.apiServices.localGetMethod("SD_OpenCOM",_cardDcom).subscribe((data:any) => {
                if(data.length > 0 && data[0]['Data'] != ""){
                  let _openCardD = JSON.parse(data[0]['Data']) || {"ResponseStatus":"1","ResponseMessage":"Invalid JSON"};
                  _cardDStatus.open = _openCardD;
                  if(_openCardD['ResponseStatus'] === "0"){
                    // ---------- Call Card Dispenser COM Init ----------
                    this.apiServices.localGetMethod("SD_Initialize","").subscribe((data:any) => {
                      if(data.length > 0 && data[0]['Data'] != ""){
                        let _initCardD = JSON.parse(data[0]['Data']) || {"ResponseStatus":"1","ResponseMessage":"Invalid JSON"};
                        _cardDStatus.init = _initCardD;
                        if(_openCardD['ResponseStatus'] === "0"){ }
                      } else{
                        _cardDStatus.init = {"ResponseStatus":"1","ResponseMessage":"API Call Result Problem"};
                      }
                      localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
                    },
                    err => {
                      _cardDStatus.init = {"ResponseStatus":"1","ResponseMessage":"API Call Error Problem"};
                      localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
                      return false;
                    });
                  }
                } else{
                  _cardDStatus.open = {"ResponseStatus":"1","ResponseMessage":"API Call Result Problem"};
                }
                localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
              },
              err => {
                _cardDStatus.open = {"ResponseStatus":"1","ResponseMessage":"API Call Error Problem"};
                localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
                return false;
              });
            } else{
              _cardDStatus.close = {"ResponseStatus":"1","ResponseMessage":"API Call Result Problem"};
            }
            localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
          }
        }, err => {
          _cardDStatus.close = {"ResponseStatus":"1","ResponseMessage":"API Call Error Problem"};
          localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
          return false;
        });
      }
    else{
              _cardDStatus.close = {"ResponseStatus":"1","ResponseMessage":"API Call Result Problem"};
            }
            localStorage.setItem("CARD_D_STATUS",JSON.stringify(_cardDStatus));
          }
      }


  public _kiosk_Minus1AvailCard(_callBack:any){
    if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != "" &&
    localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != ""){
      let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
      this.APP_KIOSK_CODE_DECRIPTED = JSON.parse(_scanData);
      this.MAC_ID = localStorage.getItem("MY_MAC_ID");

      let _passData = {
        "ID":this.APP_KIOSK_CODE_DECRIPTED['MAppSeqId'],
        "kioskCode":"",
        "kioskAvalCards":1,
        "Querytype":3
      }
      this.apiServices.localPostMethod("kioskCardUpdate", _passData).subscribe((data:any) => {
        if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
          let _res_data = JSON.parse(data[0]["Data"]);
          if(_res_data['Table'] != undefined && _res_data['Table'][0]['Code'] != undefined
          && _res_data['Table'][0]['Code'] == '10'){
            // if(_res_data['Table1'] != undefined && _res_data['Table1'].length > 0){

            // }
            _callBack(true);
            return false;
          }  else if(_res_data['Table'] != undefined && _res_data['Table'].length > 0
            && _res_data['Table'][0]['Code'] == 50){
              document.getElementById("bodyloader").style.display = "none";
            this.dialog.open(DialogAppCommonDialog, {
              width: '250px',
              disableClose:true,
              data: {title: this.MSG_STRING.UNAUTH_CALL, subTile:this.MSG_STRING.UNAUTH_CALL_SUB,
                  enbCancel:false, canceltext:"Cancel", oktext:"Ok"}
            });
            return;
          } else{
            _callBack(false);
            return false;
          }
        } else{
          _callBack(false);
          return false;
        }
      },
      err => {
        _callBack(false);
        return false;
      });
    }
  }
  public _kiosk_getAvalCards(_callBack:any){
    if(localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != undefined && localStorage.getItem("APP_KIOSK_CODE_DECRIPTED") != "" &&
    localStorage.getItem("MY_MAC_ID") != undefined && localStorage.getItem("MY_MAC_ID") != ""){
      let _scanData = localStorage.getItem("APP_KIOSK_CODE_DECRIPTED");
      this.APP_KIOSK_CODE_DECRIPTED = JSON.parse(_scanData);
      this.MAC_ID = localStorage.getItem("MY_MAC_ID");

      let _passData = {
        "ID":this.APP_KIOSK_CODE_DECRIPTED['MAppSeqId'],
        "kioskCode":"", //KIOSK_PROPERTIES['kioskCode'],
        "kioskAvalCards":1,
        "Querytype":4
      }
      this.apiServices.localPostMethod("kioskCardUpdate", _passData).subscribe((data:any) => {
        if(data.length > 0 && data[0]["Status"] === true  && data[0]["Data"] != undefined ){
          let _res_data = JSON.parse(data[0]["Data"]);
          if(_res_data['Table'] != undefined && _res_data['Table'][0]['Code'] != undefined
          && _res_data['Table'][0]['Code'] == '10'){
            if(_res_data['Table1'] != undefined && _res_data['Table1'].length > 0){
              let avail_cards = _res_data['Table1'][0]['kioskAvalCards'];
              _callBack(true, avail_cards);
              return;
            }
          } else if(_res_data['Table'] != undefined && _res_data['Table'].length > 0
            && _res_data['Table'][0]['Code'] == 50){
            document.getElementById("bodyloader").style.display = "none";
            this.dialog.open(DialogAppCommonDialog, {
              width: '250px',
              disableClose:true,
              data: {title: this.MSG_STRING.UNAUTH_CALL, subTile:this.MSG_STRING.UNAUTH_CALL_SUB,
                  enbCancel:false, canceltext:"Cancel", oktext:"Ok"}
            });
            return;
          } else{
            _callBack(false,0);
            return;
          }
        } else{
          _callBack(false,0);
          return;
        }
      },
      err => {
        _callBack(false,0);
        return false;
      });
    }
  }
  public _decrypt(encryptText){
    var key = CryptoJS.enc.Utf8.parse(AppSettings.CRYPTO_KEY);
    var iv = CryptoJS.enc.Utf8.parse(AppSettings.CRYPTO_KEY);
    var decrypted = CryptoJS.AES.decrypt(encryptText, key, {
        keySize: 128,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var resultdata = decrypted.toString(CryptoJS.enc.Utf8);
    //console.log("New Decrypt: "+resultdata);
    return resultdata;
  }
}
