export class AppointmentModal  {
    public id:string = '';
    public name:string = '';
    public email:string = '';
    public contact:string = '';
    public purpose:string = '';
    public company:string = '';
    public category:string = '';
    public categoryId:string = '';
    public address:string = '';
    public Country:string = '';
    public Gender:string = '';
    public vehicle:string = '';
    public visitorB64Image:string = '';
    public checkinCounter:string = '';
    public visitorDocB64Image:string = '';
    public hostDetails:HostDetails = new HostDetails();
    public SkipFR?:boolean = false;
    public vbookingseqid?:string = '';
}
  export class HostDetails  {
    public id:string = '';
    public name:string = '';
    public email:string = '';
    public contact:string = '';
    public company:string = '';
  }

