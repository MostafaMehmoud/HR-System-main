import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { parse, format } from 'date-fns';

@Pipe({
  name: 'time12hours'
})
export class Time12hoursPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if (value) {
      let newTime = parse(value, 'HH:mm:ss', new Date())
      return format(newTime, 'hh:mm a')
    }
    else {
      return value;
    }

  }



}
