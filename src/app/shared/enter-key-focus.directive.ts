import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnterKeyFocus]'
})
export class EnterKeyFocusDirective {

  constructor(private myElement: ElementRef) { }
  @HostListener('keydown', ['$event']) onkeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const allInputs = Array.from(this.myElement.nativeElement.form.elements).filter((item: any) => {
        return !item.readOnly && !item.disabled;})

      // const newInputs = allInputs.filter((item : any) => {
      //   return !item.readOnly;
      // })


      // console.log(allInputs, 'allInputs');
      // console.log(newInputs, 'newInputs');

      const currentInput: number = allInputs.indexOf(this.myElement.nativeElement)
      let nextInput: HTMLElement = allInputs[currentInput + 1] as HTMLElement
      nextInput.focus()
    }


  }
}
