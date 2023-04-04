export class AppointmentModal  {
    public id:string = '';
    public name:string = '';
    public email:string = '';
    public contact:string = '';
    public purpose:string = '';
    public purposeId:string = '';
    public company:string = '';
    public category:string = '';
    public categoryId:string = '';
    public address:string = '';
    public country:string = '';
    public countryId:string = '';
    public gender:string = '';
    public genderId:string = '';
    public vehicle:string = '';
    public visitor_blacklist:any = '';
    public visitorB64Image:string = '';
    public checkinCounter:string = '';
    public visitorDocB64Image:string = '';
    public hostDetails:HostDetails = new HostDetails();
    public hostName:string = '';
    public SkipFR?:boolean = false;
    public aptid?:string = '';
    public meetingHours:string = '';
    public meetingHoursValue:string = '';
    public branchID:string = '';
    public branchName:string = '';
    public Department:string='';
    public WorkPermit:string='';
    public MeetingLoc:string='';
}
  export class HostDetails  {
    public id:string = '';
    public name:string = '';
    public email:string = '';
    public contact:string = '';
    public company:string = '';
    public HostDeptId:string = '';
    public PatientName:string;
  }

