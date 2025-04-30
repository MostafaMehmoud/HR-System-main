import { Component } from '@angular/core';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.css']
})
export class HomeDashboardComponent {
  pageOpenOne: boolean = false
  pageOpenTwo: boolean = false
  pageOpenThree: boolean = false

  ngOnInit(): void {
    setTimeout(() => {this.pageOpenOne = true}, 100);
    setTimeout(() => {this.pageOpenTwo = true}, 300);
    setTimeout(() => {this.pageOpenThree = true}, 500);
  }
}
