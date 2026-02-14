import {Component, Input} from '@angular/core';
import {trackByIndex} from "../../utils/track-by";
import {ActiveParamsType} from "../../../../types/product/active-params.type";
import {Router} from "@angular/router";

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent  {
  @Input() pages!: number[];
  @Input() activeParams!:ActiveParamsType;
  constructor(private router: Router) { }




  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams
    });
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams
      });
    }

  }


  protected readonly trackByIndex = trackByIndex;
}
