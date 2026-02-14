import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {Subject, takeUntil} from "rxjs";
import {trigger, state, style, transition, animate} from '@angular/animations';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class LoaderComponent implements OnInit, OnDestroy {
  isShow: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit(): void {
    this.loaderService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.isShow = isLoading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
