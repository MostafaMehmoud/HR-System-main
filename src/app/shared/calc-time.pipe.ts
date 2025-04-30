import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'calcTime'
})
export class CalcTimePipe implements PipeTransform {

  transform(value: number, theForm: any): unknown {
    if (value) {
      let myForm = theForm as FormGroup

      if (value > 0) {
        myForm.get('workingTimeByMinute')?.setValue(value / 1000 / 60)
        //                     HOURS                      MINUETS      
        return Math.floor(value / 1000 / 60 / 60) + ' h : ' + value / 1000 / 60 % 60 + ' m ';
      }
      else{
        myForm.get('workingTimeByMinute')?.setValue(0)
        //                     HOURS                      MINUETS      
        return '00:00';
      }

    }
    return null
  }


}
