import {CounterComponent} from "./counter.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {FormsModule} from "@angular/forms";

describe('counter component', () => {
  let counterComponent:CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent],
      imports: [FormsModule]
    });
    // это некая тестовая система позволяет взимодействовать с созданным компоннетом можем проверить элемент и его содержимое на странице
    fixture = TestBed.createComponent(CounterComponent);
    counterComponent = fixture.componentInstance;

  });

  it('проверяем что в count установлено хоть какое то значение', () => {
    expect(counterComponent.count).toBeDefined();
  });
  it('проверяем что в count увеличилось на один после вызова incrementCount', () => {
    counterComponent.count = 1;
    counterComponent.incrementCount();
    expect(counterComponent.count).toBe(2);
  });

  it('проверяем что в count не уменьшилось при значение 1 после вызова функции decrementCount', () => {
    counterComponent.count = 1;
    counterComponent.decrementCount();
    expect(counterComponent.count).toBe(1);
  });
  it('проверяем что значение эммитится из компонента при вызове метода incrementCount', (done:DoneFn) => {
    counterComponent.count = 1;
    counterComponent.onCountChange.subscribe((newCount) => {
      expect(newCount).toBe(2);
      done();
    });
    counterComponent.incrementCount();

  });

  it('проверяем что значение эммитится из компонента при вызове метода decrementCount', (done:DoneFn) => {
    counterComponent.count = 2;
    counterComponent.onCountChange.subscribe((newCount) => {
      expect(newCount).toBe(1);
      done();
    });
    counterComponent.decrementCount();

  });
  it('проверяем что значение изменяется в инпуте при вызове decrementCount', (done:DoneFn) => {


    counterComponent.count =  5;
    counterComponent.decrementCount();
    // позволяет ангуляру в тестовой среде обработать нужные значнеиея и произвести нужные изменния
    fixture.detectChanges();
    // дожидаемся изменений
    fixture.whenStable().then(() => {
      const componentElement:HTMLElement = fixture.nativeElement;
      const input:HTMLInputElement= componentElement.querySelector('input') as HTMLInputElement;
      expect(input.value).toBe('4');
      done();
    });
  });
});
