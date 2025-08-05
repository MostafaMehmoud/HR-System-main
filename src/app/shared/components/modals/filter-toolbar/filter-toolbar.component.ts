import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-toolbar',
  templateUrl: './filter-toolbar.component.html',
  styleUrls: ['./filter-toolbar.component.css']
})
export class FilterToolbarComponent {
  @Input() filterSelected: string = 'all';
  @Output() onFilterClicked = new EventEmitter<string>();
  @Output() onGroupBy = new EventEmitter<string>();

  filterClicked(value: string) {
    this.onFilterClicked.emit(value);
  }

  groupBy(value: string) {
    this.onGroupBy.emit(value);
  }

}
