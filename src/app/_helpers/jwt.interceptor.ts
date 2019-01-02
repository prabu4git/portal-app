import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available

  if (request.headers.get('grant_type') === 'password') {
    return next.handle(request.clone());
  }
    if (localStorage.getItem('access_token') != null) {
      request = request.clone({
        setHeaders: {
         'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request);
  }
}
