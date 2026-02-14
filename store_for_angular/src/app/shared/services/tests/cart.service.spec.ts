import {CartService} from "../cart.service";
import {of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {TestBed} from "@angular/core/testing";


describe('cart service', () => {



  let cartService: CartService;
  const countValue = 3;
  let httpServiceSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);

    httpServiceSpy.get.and.returnValue(of({count: countValue}));

    // cartService = new CartService(httpServiceSpy);
    TestBed.configureTestingModule({
      providers: [
        CartService,
        {
          provide: HttpClient,
          useValue: httpServiceSpy
        }
      ]
    });
    cartService = TestBed.inject(CartService);
  });

  it('должен эмитить новое занчение count ', (done: DoneFn) => {
    cartService.count$.subscribe(count => {
      expect(count).toBe(countValue);
      done();
    });

    cartService.getCartCount().subscribe();
  });


  it("должен проверить запрос получения корзины товаров с обязательной опцией withCredentials", (done: DoneFn) => {
    cartService.getCart().subscribe(() => {
        expect(httpServiceSpy.get).toHaveBeenCalledOnceWith(environment.api + '/cart', {withCredentials: true});
        done();
    });
  });

});
