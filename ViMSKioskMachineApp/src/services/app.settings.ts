export const AppSettings = Object.freeze({
    APP_DEFAULT_SETTIGS:{
        "APP_TYPE":"debug",
        "SEL_LANGUAGE":"en",
        "SEL_DATE_FORMATE":"dd/MM/yyyy",
        "SEL_TIME_FORMATE":"shortTime",
        "PASSCODE":"000000",
        "COM_PORT":"COM15",
        "COUNTRY_PHONE_CODE":"+65",
        "card_allowScrnTimOut":"true",
        "card_showTimeOutMsg":"true",
        "card_scrnTimOut":"120",
        "card_showTimeOutMsgAfter":"30"
    },
    APP_API_SETUP:{
        api_url:"http://localhost:57080/",
        api_img_url:""
    },
    APP_SERVICES:{
        //----Licence & Setup-----------
        "GetMACAddress":"api/kiosk/GetMACAddress",
        "GetKIOSKDeviceInfo": "api/kiosk/GetKIOSKDeviceInfo",
        "SaveKIOSKDeviceInfo": "api/kiosk/SaveKIOSKDeviceInfo",
        "GetKIOSKSettings":"api/kiosk/GetKIOSKSettings",
        "GetAddVisitorSettings":"api/kiosk/GetAddVisitorSettings",

        "getKioskSetupData":"api/kiosk/CRUDKioskMachine",
        "kioskCardUpdate":"api/kiosk/kioskCardUpdate",
        "GetPassportDetail":"api/kiosk/GetPassportDetail",
        "getIdScanerData":"api/kiosk/getIdScanerData",
        "GetMyKadDetails":"api/kiosk/GetMyKadDetails",
        "getBusinessCardData":"api/kiosk/getBusinessCardData",

        //----Checkout --------------
        "VimsAppGetAppointmentByAttHexCode": "api/kiosk/VimsAppGetAppointmentByAttHexCode",
        "VimsAppUpdateVisitorCheckOut": "api/kiosk/VimsAppUpdateVisitorCheckOut",
        //----CardDispenser 1-----------
        "SetCardIn":"api/kiosk/SetCardIn?ComPort=",
        "EjectCard":"api/kiosk/EjectCard",
        "RejectCard":"api/kiosk/RejectCard",
        //----CardDispenser 2-----------
        "SD_OpenCOM":"api/kiosk/SD_OpenCOM?ComPort=",
        "SD_Initialize":"api/kiosk/SD_Initialize",
        "SD_GetCardStatus":"api/kiosk/SD_GetCardStatus",
        "SD_MoveCardToReaderPosition":"api/kiosk/SD_MoveCardToReaderPosition",
        "SD_GetCardSN":"api/kiosk/SD_GetCardSN",
        "SD_EjectCard":"api/kiosk/SD_EjectCard",
        "SD_RejectCard":"api/kiosk/SD_RejectCard",
        "SD_CloseCOM":"api/kiosk/SD_CloseCOM",
        //----LED ON/OFF 1-----------
        "setLEDON":"api/kiosk/setLEDON?ComPort=",
        "setLEDOFF":"api/kiosk/setLEDOFF",
        //------------------------------
        "AddAttendanceForVisitor":"api/kiosk/AddAttendanceForVisitor",
        "GetQuestionaries": "api/kiosk/GetQuestionaries",
        "getPurpose":"api/kiosk/getPurpose",
        "getVisitorCategory":"api/kiosk/getVisitorCategory",
        "getHostName":"api/kiosk/getHostName",
        "getStaffInfo":"api/kiosk/getStaffInfo",
        "getStaffTemperature":"api/kiosk/getStaffTemperature",
        "SaveStaffTemperature":"api/kiosk/SaveStaffTemperature",
        "getVisitorInfo":"api/kiosk/getVisitorInfo",
        "getAptmentInformation":"api/kiosk/getAptmentInformation",
        "getVisitorInformation":"api/kiosk/getVisitorInformation",
        "visitorCheckOut":"api/kiosk/visitorCheckOut",
        "visitorIndividualCheckIn":"api/kiosk/visitorIndividualCheckIn",
        "PrintVisitorLabel":"api/kiosk/PrintVisitorLabel",
        "PrintVisitorReceipt":"api/kiosk/PrintVisitorReceipt",
        "getTemplateData":"api/kiosk/getTemplateData",

        "VisitorAckSave":"api/vims/VisitorAckSave"

        // "getKioskSetupData":"api/Device/CRUDKioskMachine",
        // "kioskCardUpdate":"api/Device/kioskCardUpdate",
        // "GetPassportDetail":"api/Device/GetPassportDetail",
        // "getIdScanerData":"api/Device/getIdScanerData",
        // "GetMyKadDetails":"api/Device/GetMyKadDetails",
        // "getBusinessCardData":"api/Device/getBusinessCardData",
        // //----CardDispenser 1-----------
        // "SetCardIn":"api/Device/SetCardIn?ComPort=",
        // "EjectCard":"api/Device/EjectCard",
        // "RejectCard":"api/Device/RejectCard",
        // //----CardDispenser 2-----------
        // "SD_OpenCOM":"api/Device/SD_OpenCOM?ComPort=",
        // "SD_Initialize":"api/Device/SD_Initialize",
        // "SD_GetCardStatus":"api/Device/SD_GetCardStatus",
        // "SD_MoveCardToReaderPosition":"api/Device/SD_MoveCardToReaderPosition",
        // "SD_GetCardSN":"api/Device/SD_GetCardSN",
        // "SD_EjectCard":"api/Device/SD_EjectCard",
        // "SD_RejectCard":"api/Device/SD_RejectCard",
        // "SD_CloseCOM":"api/Device/SD_CloseCOM",
        // //----LED ON/OFF 1-----------
        // "setLEDON":"api/Device/setLEDON?ComPort=",
        // "setLEDOFF":"api/Device/setLEDOFF",
        // //------------------------------
        // "AddAttendanceForVisitor":"api/Device/AddAttendanceForVisitor",
        // "getPurpose":"api/Device/getPurpose",
        // "getVisitorCategory":"api/Device/getVisitorCategory",
        // "getHostName":"api/Device/getHostName",
        // "getVisitorInfo":"api/Device/getVisitorInfo",
        // "getAptmentInformation":"api/Device/getAptmentInformation",
        // "getVisitorInformation":"api/Device/getVisitorInformation",
        // "visitorCheckOut":"api/Device/visitorCheckOut",
        // "visitorIndividualCheckIn":"api/Device/visitorIndividualCheckIn",
        // "PrintVisitorLabel":"api/Device/PrintVisitorLabel",
        // "PrintVisitorReceipt":"api/Device/PrintVisitorReceipt",
        // "getTemplateData":"api/Device/getTemplateData"
    },
    CRYPTO_KEY:"qweqweqweqweqweq",
    // getVisitorInfo(psParam.hostnumber
    //     visitorIndividualCheckIn(psParam.visitorref, psParam.visitorcardno
    //     visitorCheckOut(psParam.hostnumber
    // -------- SQlite DB Setup ------------
    LOCAL_SQLITE_DB_NAME:"vims-kiosk-01.db",
    LOCAL_USER_SETUP:{
        "enb_version_choose": true,
        "enb_language_choose": true,
    },

    LOCAL_STORAGE: {
      "MAIN_MODULE": "MAIN_MODULE",
      "BRANCH_ID": "KIOSK_BRANCH_ID"
    },

    SHOW_START_WIZARD: false, // Intro wizard Show / Hide Option

    // -------- Language Setup ------------
    AVAILABLE_LANGUAGE:[
        {"id" : "en", "TCODE": "LANGUAGE.ENGLISH"},
        {"id" : "bm", "TCODE": "LANGUAGE.MALAY"},
        {"id" : "tm", "TCODE": "LANGUAGE.TAMIL"}
      ],
    AVAILABLE_LAYOUTS:[
        {"id" : "1", "text": "Layout 1"},
        {"id" : "2", "text": "Layout 2"},
        {"id" : "3", "text": "Layout 3"},
        {"id" : "4", "text": "Layout 4"}
    ],
    AVAILABLE_TIME_FORMATE: [
        { text: "2:30 PM", value: "shortTime" },
        { text: "2:30:45 PM", value: "mediumTime" },
        { text: "13:00", value: "H:mm" },
        { text: "13:00:45", value: "H:mm:ss" }
    ],
    AVAILABLE_DATE_FORMATE: [
        { text: "6/15/15", value: "shortDate" },
        { text: "06/15/2015", value: "dd/MM/yyyy" },
        { text: "Jun 15, 2015", value: "mediumDate" },
        { text: "June 15, 2015", value: "longDate" },
        { text: "Monday, June 15, 2015", value: "fullDate" },
    ],
    AVAILABLE_CONTROL_TYPE: [
        { text: "String", value: "String" },
        { text: "Time", value: "Time" },
        { text: "Date", value: "Date" },
    ],
    LOG_SUCCESS: [
        'background: white',
        'color: green',
        'display: block',
        'text-align: center'
       ].join(';'),
    LOG_INFO: [
        'background: white',
        'color: blue',
        'display: block',
        'text-align: center'
       ].join(';'),
    LOG_FAILED: [
        'background: white',
        'color: red',
        'display: block',
        'text-align: center'
       ].join(';')
});
