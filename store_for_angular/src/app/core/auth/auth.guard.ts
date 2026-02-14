import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "./auth.service";
import {ToastService} from "../../shared/services/toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private authService: AuthService, private router:Router, private toastService: ToastService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.getIsLoggedIn()) {
      return true;
    }
    this.toastService.showToast('info', "Авторизуйтесь или зарегистрируйтесь", "Для того чтобы попасть на эту страницу вы должны быть зарегистрированы", 3000);
    this.router.navigate(['/login']);
    return false;
  }

}
