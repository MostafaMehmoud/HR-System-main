import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {


  pageOpenOne: boolean = false




  ngOnInit(): void {
    setTimeout(() => { this.pageOpenOne = true }, 100);
  }

}
