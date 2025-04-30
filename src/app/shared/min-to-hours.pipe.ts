import { Pipe, PipeTransform } from '@angular/core';
import { minutesToHours } from 'date-fns';


@Pipe({
  name: 'minToHours'
})
export class MinToHoursPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value > 0) {
      let hours = minutesToHours(value)
      let minutes = (value % 60)
      // if hours > 0   display hours and minutes >>>> not ? display minutes only
      return hours > 0 ?( `${hours} h : ${minutes} m` ): (`${minutes}m`)
    }

    else {
      return 0
    }
  }

}
