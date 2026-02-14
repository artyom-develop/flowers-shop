import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ProductCardComponent} from "./product-card.component";
import {CartService} from "../../services/cart.service";
import {AuthService} from "../../../core/auth/auth.service";
import {ToastService} from "../../services/toast.service";
import {Router} from "@angular/router";
import {FavoriteService} from "../../services/favorite.service";
import {of} from "rxjs";
import {ProductType} from "../../../../types/product/ProductType.type";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('product-card component', () => {
  let productCardComponent: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let product: ProductType;
  beforeEach(() => {
    const cartService = jasmine.createSpyObj("CartService", ["updateCart"]);
    const authService = jasmine.createSpyObj("AuthService", ["getIsLoggedIn"]);
    const toastService = jasmine.createSpyObj("ToastService", ["showToast"]);
    const router = jasmine.createSpyObj("Router", ["navigate"]);
    const favoriteService = jasmine.createSpyObj("FavoriteService", ["addFavorite", "deleteFavorite"]);
    TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ProductCardComponent],
        providers: [
          {
            provide: CartService,
            useValue: cartService,
          },
          {
            provide: AuthService,
            useValue: authService,
          },
          {
            provide: ToastService,
            useValue: toastService,
          },
          {
            provide: Router,
            useValue: router,
          },
          {
            provide: FavoriteService,
            useValue: favoriteService,
          },
        ],
      },
    );
    fixture = TestBed.createComponent(ProductCardComponent);
    productCardComponent = fixture.componentInstance;

    product = {
      id: 'test',
      name: 'test',
      price: 1,
      image: 'test',
      lightning: 'test',
      humidity: 'test',
      temperature: 'test',
      height: 1,
      diameter: 1,
      url: 'test',
      type: {
        id: 'test',
        name: 'test',
        url: 'test'
      },
    } as ProductType;
    productCardComponent.product = product;

  });

  it('проверяем что в count установлено значение один', () => {
    expect(productCardComponent.count).toBe(1);
  });

  it('проверяем установку значения в поле count из countInCart', () => {
    productCardComponent.countInCart = 5;
    fixture.detectChanges();

    expect(productCardComponent.count).toBe(5);


  });

  it('проверяем вызов deleteProduct со значением ноль', () => {
    let cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    cartServiceSpy.updateCart.and.returnValue(of({
      items: [{
        product: {
          id: "1",
          name: "1",
          url: "1",
          image: "1",
          price: 1
        },
        quantity: 1
      }]
    }));


    productCardComponent.product = product;
    productCardComponent.removeFromCart();

    expect(cartServiceSpy.updateCart).toHaveBeenCalledWith(product.id, 0);

  });

  it('должен скрывать некоторую информацию компонента если опция light пришла как true', () => {
    productCardComponent.isShowLight = true;
    fixture.detectChanges();

    const componentElement: HTMLElement = fixture.nativeElement;
    const productCardGroup: HTMLElement | null = componentElement.querySelector('.product__group');
    const productCardFooter: HTMLElement | null = componentElement.querySelector('.product__footer');
    const productCardArrow: HTMLElement | null = componentElement.querySelector('.arrow');

    expect(productCardGroup).toBeNull();
    expect(productCardFooter).toBeNull();
    expect(productCardArrow).toBeNull();
  });
  it('должен вызывать метод navigate для карточек с isShowLight=true', () => {
    let routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    productCardComponent.isShowLight = true;

    productCardComponent.navigate();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
  it('не должен вызывать метод navigate для карточек с isShowLight=false', () => {
    let routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    productCardComponent.isShowLight = false;

    productCardComponent.navigate();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
