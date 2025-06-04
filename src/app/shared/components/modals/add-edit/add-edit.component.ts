import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent {
  @Input() configurationName: string = '';
  @Input() NameAr: string = '';
  @Input() NameEn: string = '';
  @Input() addOrEdit: string = '';
  @Input() configurationForm!: FormGroup;
  @Input() textError: string = '';
  @Input() wrongError: boolean = false;
  @Input() submited: boolean = false;

  @Output() submit = new EventEmitter<void>();

  @ViewChild('modalCloseBtn') modalCloseBtn!: ElementRef;
  @ViewChild('modalRef', { static: false }) modalRef!: ElementRef;
  modal: any;

  ngAfterViewInit() {
    this.modal = new bootstrap.Modal(this.modalRef.nativeElement);
  }

  open() {
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }


  onSubmit() {
    if (this.configurationForm.valid) {
      this.submit.emit();
    }
  }

  preventDefault() {
    this.onSubmit()
    return false;
  }

}
