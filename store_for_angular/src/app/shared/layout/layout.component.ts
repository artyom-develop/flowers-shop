import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "../services/category.service";
import {Subject, takeUntil} from "rxjs";
import {MapType} from "../../../types/category/mapType.type";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  categories: MapType[] = [];
  private destroy$ = new Subject<void>();

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit(): void {
    this.categoryService.getTypesOfCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: MapType[]) => {
        this.categories = categories.map(item => {
          return Object.assign({
            typesUrl: item.types.map(item => item.url)
          }, item);
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
