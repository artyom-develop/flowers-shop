import {Component, Input} from '@angular/core';
import {ActiveParamsType} from "../../../../types/product/active-params.type";
import {AppliedFilterType} from "../../../../types/category/appliedFilter.type";
import {Router} from "@angular/router";

@Component({
  selector: 'applied-filter',
  templateUrl: './applied-filter.component.html',
  styleUrls: ['./applied-filter.component.scss']
})
export class AppliedFilterComponent  {
  @Input() activeParams!: ActiveParamsType;
  @Input() appliedFilter!: AppliedFilterType;

  constructor(private router: Router) {
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType): void {
    if (appliedFilter.urlParam === 'heightFrom' ||
      appliedFilter.urlParam === 'heightTo' ||
      appliedFilter.urlParam === 'diameterFrom' ||
      appliedFilter.urlParam === 'diameterTo'
    ) {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter(type => {
        return type !== appliedFilter.urlParam;
      });
    }
    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }
}
