import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlOptions, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.css']
})
export class TimeSheetComponent {
  constructor(private _FormBuilder: FormBuilder, private _Renderer2: Renderer2) { }

  reciver:any 

  reciveITformChild(){
    
  }

  tiemSheet: FormGroup = this._FormBuilder.group({
    bigFormArray: this._FormBuilder.array([])
  })


  // customValidator
  isAbssent(id: number, status: boolean, parent: HTMLElement) {
    let MyForm = this.bigFormArray.controls[id]
    if (status == true) {
      MyForm.disable()
      MyForm.patchValue({
        workingTime: [],
        time1: [null],
        time2: [null],
        early: [null],
        late: [null],
        project: [null],

      })

      MyForm.get('abbsent')?.enable()
    }
    else {
      MyForm.enable()
      MyForm.get('name')?.enable()
    }

  }

  get bigFormArray() {
    return this.tiemSheet.get('bigFormArray') as FormArray
  }


  ngOnInit(): void {
    for (let i = 0; i < 15; i++) {
      let newRow = this._FormBuilder.group({
        id: [null],
        img: [null],
        name: [null],
        date: [null],
        time1: [null],
        time2: [null],
        early: [null],
        late: [null],
        workingTime: [null],
        project: [null],
        abbsent: [null],
      })
      this.bigFormArray.push(newRow)
    }
  }

  addNow() {
    console.log(this.bigFormArray.value);
  }


}

