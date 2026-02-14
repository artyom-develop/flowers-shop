import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from "@angular/forms";

@Directive({
  selector: '[passwordRepeat]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordRepeatDirective, multi: true,
  }]
})
export class PasswordRepeatDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password') as AbstractControl;
    const repeatPassword = control.get('repeatPassword') as AbstractControl;

    if (password?.value.toLowerCase() !== repeatPassword?.value.toLowerCase()) {
      repeatPassword?.setErrors({
        passwordRepeat: true,
      });
      return {
        passwordRepeat: true,
      };
    }
    return null;
  }
}
