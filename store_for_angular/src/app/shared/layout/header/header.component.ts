import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../services/toast.service";
import {trackById, trackByIndex} from "../../utils/track-by";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";
import {MapType} from "../../../../types/category/mapType.type";
import {CartService} from "../../services/cart.service";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product/ProductType.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  protected readonly trackById = trackById;
  isLogged: boolean = false;
  @Input() categories!: MapType[];
  countProductInCart: number | 0 = 0;

  products: ProductType[] = [];
  searchField = new FormControl();
  showedSearch: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService, private cartService: CartService, private productService: ProductService,
             ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }


  ngOnInit(): void {
    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLogged => this.isLogged = isLogged);
    this.cartService.getCartCount().subscribe((data: DefaultResponseType | { count: number }) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }

      this.countProductInCart = (data as { count: number }).count;
    });
    this.cartService.count$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.countProductInCart = count);

    this.searchField.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value).pipe(takeUntil(this.destroy$),).subscribe((data: ProductType[]) => {
            this.products = data;
            this.showedSearch = true;
          });
        } else {
          this.products = [];
        }
      });
  }

  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.doLogout();
      },
      error: (error: HttpErrorResponse) => {
        this.doLogout();
      }
    });
  }

  doLogout() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.toastService.showToast('success',
      "Успешно",
      'Вы успешно вышли из системы.');
    this.router.navigate(['/']);
  }


  selectProduct(url: string) {
    this.router.navigate(['/detail/' + url]);
    this.searchField.setValue('');
    this.products = [];
  }

  changeShowedSearch(value: boolean) {
    setTimeout(() => {
      this.showedSearch = value;
    }, 100);

  }

  // @HostListener('document:click', ['$event'])
  // click(event: Event){
  //   if(this.showedSearch && (event.target as HTMLInputElement).className.indexOf('search__product') === -1) {
  //     this.showedSearch = false;
  //   }
  // }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected readonly trackByIndex = trackByIndex;
  protected readonly environment = environment;
}
