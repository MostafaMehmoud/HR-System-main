import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  pageOpenOne: boolean = false
  pageOpenTwo: boolean = false
  pageOpenThree: boolean = false

  ngOnInit(): void {
    setTimeout(() => {this.pageOpenOne = true}, 100);
    setTimeout(() => {this.pageOpenTwo = true}, 300);
    setTimeout(() => {this.pageOpenThree = true}, 500);
  }

}
