import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from '../services/localstorage.service';

@Injectable()
export class UniversalAppInterceptor implements HttpInterceptor {

  constructor( private localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.localStorageService.get('token');
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `x-access-token ${token}`
      }
    });
    return next.handle(req);
  }
}