
import { inject, Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS, HttpEvent, HttpHandler,
  HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token-service';

@Injectable()
export class AuthenticationInterceptorService implements HttpInterceptor {
  private tokenService = inject(TokenService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();
    if (token && req.url.startsWith('http://localhost:8080/books-api/')) {
      return next.handle(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      }));
    }
    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptorService, multi: true }
];
