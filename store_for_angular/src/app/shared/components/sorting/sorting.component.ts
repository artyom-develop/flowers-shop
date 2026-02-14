import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/product/active-params.type";

@Component({
  selector: 'sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss']
})
export class SortingComponent  {
  @Input() activeParams!:ActiveParamsType;
  @Input() sortingOpen!:boolean;
  constructor(private router: Router) { }





  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }
  sortingOptions: { name: string, value: string }[] = [
    {
      name: ' От А до Я',
      value: 'az-asc'
    },
    {
      name: ' От Я до А',
      value: 'az-desc'
    },
    {
      name: ' По возрастанию цены',
      value: 'price-asc'
    },
    {
      name: ' По убыванию цены',
      value: 'price-desc'
    },
  ];

  sort(value: string): void {
    this.activeParams.sort = value;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }
}
