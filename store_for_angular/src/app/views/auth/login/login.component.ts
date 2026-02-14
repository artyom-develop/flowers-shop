import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {LoginResponseType} from "../../../../types/auth/login/LoginResponseType.type";
import {DefaultResponseType} from "../../../../types/common/DefaultResponse.type";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../../shared/services/toast.service";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private isHide: boolean = true;

  private _destroy$: Subject<void> = new Subject<void>();
  loginForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
      password: ['', [Validators.required, Validators.pattern('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}')]],
      rememberMe: [false]
    }
  );

  constructor(private fb: FormBuilder, private authService: AuthService,
              private toastService: ToastService, private router: Router) {
  }



  login() {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const rememberMe = !!this.loginForm.value.rememberMe;

      this.authService.login(email, password, rememberMe)
        .pipe(takeUntil(this._destroy$))
        .subscribe({
        next: (data: DefaultResponseType | LoginResponseType) => {

          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }
          const loginResponse = data as LoginResponseType;
          if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
            error = "Ошибка авторизации.";
          }
          if (error) {

            this.toastService.showToast('error', 'Ошибка авторизации', error);
            throw Error(error);
          }

          this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
          this.authService.userId = loginResponse.userId;
          this.toastService.showToast('success', "Успешно", "Вы успешно вошли в систему.");
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {

          if (err.error && err.error.message) {
            this.toastService.showToast('error', 'Ошибка', err.error.message);
          } else {

            this.toastService.showToast('error', 'Ошибка', 'Ошибка авторизации.');
          }
        }
      });

    }
  }

  toggleHide() {
    this.isHide = !this.isHide;
  }

  getIsHide() {
    return this.isHide;
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
