import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'fullTime2'
})
export class FullTime2Pipe implements PipeTransform {

  transform(value: unknown, theForm: any): unknown {
    if (value) {
      let myForm = theForm as FormGroup
      myForm.get('leave')?.setValue(value + ':00')
      return value ;
    }
    return null
  }

}
