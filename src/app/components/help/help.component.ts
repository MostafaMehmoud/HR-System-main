import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  pageOpenOne: boolean = false
  myData: any[] = [
    {
      name: 'ahmed',
      age: 30,
      salary: 4000
    },
    {
      name: 'ali',
      age: 20,
      salary: 8000
    },
    {
      name: 'aya',
      age: 22,
      salary: 2500
    }
  ]

  ngOnInit(): void {
    setTimeout(() => { this.pageOpenOne = true }, 100);
  }

  sendToExel() {
    const mySheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.myData)
    const myWorkBook : XLSX.WorkBook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet( myWorkBook , mySheet , 'firstSheet')
    XLSX.writeFile( myWorkBook , 'hamada.xlsx' )
  }

}
