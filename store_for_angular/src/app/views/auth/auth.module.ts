import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    ToastModule, RippleModule,

    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AuthRoutingModule, SharedModule
  ],
})
export class AuthModule {
}
