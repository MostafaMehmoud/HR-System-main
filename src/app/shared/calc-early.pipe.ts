import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'calcEarly'
})
export class CalcEarlyPipe implements PipeTransform {

  transform(value: number, theForm: any): unknown {
    let Early_Late = 32400000 - value // هذا الرقم يترجم الي الساعة التاسعة صباحاً
    let Hours = Math.floor(Early_Late / 1000 / 60 / 60)
    let Min = Math.floor(Early_Late / 1000 / 60 % 60)
    let myForm = theForm as FormGroup

    if (Early_Late <= 0) {
      myForm.get('earlyByMinute')?.setValue(0)
      return '00:00'
    }

    else if (Early_Late > 0) {

      // اعداد القيمة بالدقائق فقط 
      myForm.get('earlyByMinute')?.setValue(Early_Late / 1000 / 60)

      // اذا كانت الدقائق اصغر من 10 تظهر 9 فقط .. هذه المعادة تجعلها تظهر 09
      return (Hours < 10 ? '0' + Hours : Hours) + 'h : ' + (Min < 10 ? '0' + Min : Min) + ' m ';

    }

    return ''
  }

}
