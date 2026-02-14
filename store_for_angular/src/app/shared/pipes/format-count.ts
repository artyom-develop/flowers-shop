import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatCountInCart'
})
export class FormatCountInCartPipe implements PipeTransform {

  transform(value: number): string {

    if (value > 9) {
      return '9+';
    }
    return value.toString();
  }

}
