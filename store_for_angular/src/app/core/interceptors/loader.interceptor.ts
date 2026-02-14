import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {LoaderService} from '../../shared/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Показываем лоадер перед запросом
    this.loaderService.show();

    return next.handle(req).pipe(
      finalize(() => {
        // Скрываем лоадер после завершения запроса (успех или ошибка)
        this.loaderService.hide();
      })
    );
  }
}
