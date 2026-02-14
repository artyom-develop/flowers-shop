import {LoaderService} from "../loader.service";

describe('loader service', () => {
  let loaderService: LoaderService;
  beforeEach(() => {
    loaderService = new LoaderService();
  });

  it('проверяем что в результате вызова метода show у нас эмитится значение isShow со значением true', (done: DoneFn) => {
    loaderService.isShow$.subscribe(value=>{
      expect(value).toBe(true);
      done();
    });

    loaderService.show();
  });
  it('проверяем что в результате вызова метода hide у нас эмитится значение isShow со значением false', (done: DoneFn) => {
    loaderService.isShow$.subscribe(value=>{
      expect(value).toBe(false);
      done();
    });

    loaderService.hide();
  });
});
