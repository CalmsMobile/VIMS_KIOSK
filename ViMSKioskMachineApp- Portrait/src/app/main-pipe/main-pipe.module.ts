import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { startsWithPipe, containsWithPipe, endsWithPipe } from './my-own-filters.pipe';

@NgModule({
  declarations: [
    SafeHtmlPipe,
    containsWithPipe,
    startsWithPipe,
    endsWithPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    SafeHtmlPipe,
    containsWithPipe,
    startsWithPipe,
    endsWithPipe
  ]
})
export class MainPipeModule { }
