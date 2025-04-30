import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'fullTime'
})
export class FullTimePipe implements PipeTransform {

  transform(value: unknown, theForm: any): unknown {
    if (value) {
      let myForm = theForm as FormGroup
      myForm.get('start')?.setValue(value + ':00')
      return value ;
    }
    return null
  }

}
