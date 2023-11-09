import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import Keyboard from "simple-keyboard";
//import layout from "simple-keyboard-layouts/build/layouts/japanese";


@Component({
  selector: 'app-keboard-bottom-sheet',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './keboard-bottom-sheet.component.html',
  styleUrls: ['./keboard-bottom-sheet.component.scss']
})
export class KeboardBottomSheetComponent {
  value = "";
  keyboard: Keyboard;
  @ViewChild('inputId') inputId: ElementRef;
  constructor(private bottomSheetRef: MatBottomSheetRef<KeboardBottomSheetComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,) {

  }

  ngAfterViewInit() {
    if (this.data.mode == 'numeric') {
      this.keyboard = new Keyboard({
        debug: true,
        inputName: "inputId",
        onChange: input => this.onChange(input),
        onKeyPress: button => this.onKeyPress(button),
        preventMouseDownDefault: false,
        layout: {
          default: ["1 2 3", "4 5 6", "7 8 9", "+ 0 {bksp}", "{enter}"]
        },
        display: {
          '{bksp}': 'Delete',
          '{enter}': 'OK',
        },
        theme: "hg-theme-default hg-layout-numeric numeric-theme"

      });
    } else {
      this.keyboard = new Keyboard({
        debug: true,
        inputName: "inputId",
        onChange: input => this.onChange(input),
        onKeyPress: button => this.onKeyPress(button),
        preventMouseDownDefault: false,
        display: {
          '{bksp}': 'Delete',
          '{enter}': 'OK',
          '{tab}': 'tab',
          '{lock}': 'caps',
          '{shift}': 'shift',
          '{space}': 'space',
        },
      });
    }
    //this.keyboard.replaceInput({ inputId: "test" })


    setTimeout(() => {
      this.keyboard.setInput(this.data.value);
      this.inputId.nativeElement.value = this.data.value;
      this.inputId.nativeElement.focus();
    });
  }

  onChange = (input: string) => {
    /* this.value = input;
    console.log("Input changed", input); */
    setTimeout(() => {
      this.inputId.nativeElement.value = input.toUpperCase();
      //this.box.nativeElement.focus();
      //this.onKey(this.box.nativeElement.value, null)
    });
  };

  onKeyPress = (button: string) => {
    console.log("Button pressed", button);
    if (button == "{enter}") {
      this.bottomSheetRef.dismiss(this.inputId.nativeElement.value)
    }
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };
  /*  onChange = (input: string) => {
     setTimeout(() => {
       this.box.nativeElement.value = this.data.value+ input.toUpperCase();
       //this.box.nativeElement.focus();
       //this.onKey(this.box.nativeElement.value, null)
     });

     //this.inputValue = input;
     console.log("Input changed", input);
   };

   onKeyPress = (button: string) => {
     console.log("Button pressed", button);
     if (button == "{enter}") {
       this.bottomSheetRef.dismiss(this.box.nativeElement.value)
     }
     if (button == "{bksp}") {

     }

     if (button === "{shift}" || button === "{lock}") this.handleShift();
   };

   onInputChange = (event: any) => {
     this.keyboard.setInput(event.target.value);
   };

   handleShift = () => {
     let currentLayout = this.keyboard.options.layoutName;
     let shiftToggle = currentLayout === "default" ? "shift" : "default";

     this.keyboard.setOptions({
       layoutName: shiftToggle
     });
   }; */
}
