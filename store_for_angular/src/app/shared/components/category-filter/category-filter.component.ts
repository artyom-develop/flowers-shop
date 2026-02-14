import {Component, Input, OnInit} from '@angular/core';
import {trackById} from "../../utils/track-by";
import {MapType} from "../../../../types/category/mapType.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/product/active-params.type";
import {ActiveParamsUtil} from "../../utils/active-params.util";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  @Input() category: MapType | null = null;
  @Input() type: string | null = null;
  toggleOpenClass = false;

  activeParams: ActiveParamsType = {
    types: [],
  };

  from: number | null = null;
  to: number | null = null;

  protected readonly trackById = trackById;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {

      this.activeParams = ActiveParamsUtil.processParams(params);

      if (this.type) {

        if (this.type === 'height') {

          this.toggleOpenClass = !!(this.activeParams.heightFrom || this.activeParams.heightTo);
          this.from = this.activeParams.heightFrom ? +this.activeParams.heightFrom : null;
          this.to = this.activeParams.heightTo ? +this.activeParams.heightTo : null;
        } else if (this.type === 'diameter') {

          this.toggleOpenClass = !!(this.activeParams.diameterTo || this.activeParams.diameterFrom);
          this.from = this.activeParams.diameterFrom ? +this.activeParams.diameterFrom : null;
          this.to = this.activeParams.diameterTo ? +this.activeParams.diameterTo : null;
        }
      }
      else {
        this.activeParams.types = Array.isArray(params['types']) ? params['types'] : params['types'] ? [params['types']] : [];

        if (this.category && this.category.types && this.category.types.length > 0 && this.category.types.some(typeItem =>
          this.activeParams.types.includes(typeItem.url)
        )) {
          this.toggleOpenClass =  true;
        }
      }
    });
  }

  toggle(){
    this.toggleOpenClass = !this.toggleOpenClass;
  }
  get title(): string {
    if (this.category) {
      return this.category.name;
    } else if (this.type) {
      if (this.type === 'height') {
        return 'Высота';
      } else if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }
    return '';
  }

  updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url
      );

      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url);

      } else if (!existingTypeInParams && checked) {
        this.activeParams.types = [...this.activeParams.types, url];

      }
    } else if (checked) {
      this.activeParams.types = [url];

    }
    this.activeParams.page =1;

    this.router.navigate(['/catalog'], {
      queryParams:
      this.activeParams
    });
  }

  updateFilterFromToParams(param: string, value: string) {
    if (param === 'heightTo' || param === "heightFrom" || param === "diameterFrom" || param === "diameterTo") {
      if (this.activeParams[param] && !value) {
        delete this.activeParams[param];
      } else {
        this.activeParams[param] = value;
      }
      this.activeParams.page =1;
      this.router.navigate(['/catalog'], {
        queryParams:
        this.activeParams
      });
    }

  }

}

