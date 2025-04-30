import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
nameAr:any = localStorage.getItem('employeeNameAR')
nameEN:any = localStorage.getItem('employeeNameEN')
pageOpenOne:boolean = false

ngOnInit(): void {
  setTimeout(() => {this.pageOpenOne = true}, 100);
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  
}
}
