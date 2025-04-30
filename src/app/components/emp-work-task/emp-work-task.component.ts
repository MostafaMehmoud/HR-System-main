import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { empOrderTaskInterface, personalDataTask, TaskDetails } from 'src/app/shared/interfaces/task';
import { TaskService } from 'src/app/shared/services/task.service';
import * as html2pdf from 'html2pdf.js';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-emp-work-task',
  templateUrl: './emp-work-task.component.html',
  styleUrls: ['./emp-work-task.component.css']
})
export class EmpWorkTaskComponent {
  constructor(private _router: Router, private _TaskService: TaskService, private _TranslateService: TranslateService, private _spinner: NgxSpinnerService) { }
  ordersList: empOrderTaskInterface[] = []
  oneTask: empOrderTaskInterface = {} as empOrderTaskInterface
  visasArray: any[] = []
  nameAr: any = localStorage.getItem('employeeNameAR')
  nameEN: any = localStorage.getItem('employeeNameEN')
  empId: any = ''
  mypersonalDetails: personalDataTask = {} as personalDataTask
  // langO: any = localStorage.getItem('myLanguage')

  ngOnInit(): void {
    if (localStorage.getItem('userToken') == (null || undefined)) {
      this._router.navigate(['login'])
    }
    this._TaskService.getAllEmpTasks().subscribe({
      next: (data) => {
        this.ordersList = data.requestJobMissions
        this.ordersList = this.ordersList.sort((a, b) => { return a.id - b.id }).reverse()
        console.log(this.ordersList);
      },
      error: (err) => {
        console.log(err);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._router.navigate(['login'])
        }
      },
    })

    this._TaskService.getBasicData().subscribe({
      next: (Response) => {
        this.nameAr = Response.nameAr
        this.nameEN = Response.nameEn
        this.empId = Response.empId
        this.mypersonalDetails = Response
        console.log(Response);
      },

      error: (err) => {
        console.log(err);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._router.navigate(['login'])
        }
      }
    })

  }


  get currentLang() {
    return this._TranslateService.currentLang
  }


  downloadPDF(order: any) {
    this._spinner.show("spinner2")
    console.log(order);
    this.oneTask = order
    this.oneTask.visas ? this.visasArray = this.oneTask.visas.split(',') : ''
    this.setPDF()
  }


  setPDF() {
    const element = document.getElementById('content');
    element!.style.display = 'block';
    const options = {
      margin: 0,
      filename: 'تقرير.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save().then(() => {
      element!.style.display = 'none';
      this._spinner.hide("spinner2")
    });
  }


}
