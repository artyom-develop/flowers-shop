import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {ToastService} from "../../../shared/services/toast.service";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {LoginResponseType} from "../../../../types/auth/login/LoginResponseType.type";
import {HttpErrorResponse} from "@angular/common/http";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnDestroy {
  repeatHide: boolean = true;
  passwordHide: boolean = true;

  private _destroy$: Subject<void> = new Subject<void>();
  signUpForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      password: ['', [Validators.required, Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}')]],
      repeatPassword: ['', [Validators.required, Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}')]],
      rememberMe: [false, [Validators.requiredTrue]],
    }
  );

  constructor(private fb: FormBuilder, private authService: AuthService,
              private toastService: ToastService, private router: Router) {
  }



  signup() {
    if (this.signUpForm.valid && this.signUpForm.value.email && this.signUpForm.value.repeatPassword && this.signUpForm.value.password && this.signUpForm.value.rememberMe) {

      this.authService.signUp(this.signUpForm.value.email, this.signUpForm.value.password, this.signUpForm.value.repeatPassword)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
        next: (data: DefaultResponseType | LoginResponseType) => {
          let error = null;

          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          const signupResponse = data as LoginResponseType;
          if (!signupResponse.accessToken || !signupResponse.refreshToken || !signupResponse.userId) {
            error = "Ошибка авторизации.";
          }
          if (error) {
            this.toastService.showToast('error', 'Ошибка авторизации', error);
            throw Error(error);
          }
          this.authService.setTokens(signupResponse.accessToken, signupResponse.refreshToken);
          this.authService.userId = signupResponse.userId;
          this.toastService.showToast('success', "Успешно", "Вы успешно зарегистрировались.");
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {

          if (err.error && err.error.message) {
            this.toastService.showToast('error', 'Ошибка', err.error.message);
          } else {

            this.toastService.showToast('error', 'Ошибка', 'Ошибка регистрации.');
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
