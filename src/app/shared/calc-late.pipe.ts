import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'CalcLate'
})
export class CalcLatePipe implements PipeTransform {




  transform(value: number, theForm: any): unknown {
    let Early_Late = value - 32400000// هذا الرقم يترجم الي الساعة التاسعة صباحاً
    let Hours = Math.floor(Early_Late / 1000 / 60 / 60)
    let Min = Math.floor(Early_Late / 1000 / 60 % 60)
    let myForm = theForm as FormGroup

    if (Early_Late <= 0) {
      myForm.get('lateByMinute')?.setValue(0)
      return '00:00'
    }

    else if (Early_Late > 0) {
      // اذا كانت الدقائق اصغر من 10 تظهر 9 فقط .. هذه المعادة تجعلها تظهر 09
      // اعداد القيمة بالدقائق فقط 
      myForm.get('lateByMinute')?.setValue(Early_Late / 1000 / 60)
      // اظهار القيمة للمستخدم بالساعات و الدقائق
      return (Hours < 10 ? '0' + Hours : Hours) + 'h : ' + (Min < 10 ? '0' + Min : Min) + ' m ';
    }

    return ''
  }

}
