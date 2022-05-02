import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myOwnFilters'
})
export class MyOwnFiltersPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
@Pipe({name: 'myContains'})
export class containsWithPipe implements PipeTransform {
  transform(value: any[], filedName:string, term: string): any[] {
    return value.filter((x:any) => (x[filedName].toLowerCase().indexOf(term.toLowerCase())  > -1 ));
  } 
}

@Pipe({name: 'myStartsWith'})
export class startsWithPipe implements PipeTransform {
  transform(value: any[], filedName:string, term: string): any[] {
    return value.filter((x:any) => x[filedName].toLowerCase().startsWith(term.toLowerCase()))

  } 
}

@Pipe({name: 'myEndsWith'})
export class endsWithPipe implements PipeTransform {
  transform(value: any[], filedName:string, term: string): any[] {
    return value.filter((x:any) => x[filedName].toLowerCase().endsWith(term.toLowerCase()))

  } 
}