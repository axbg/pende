import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; 
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class HTTPInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthServiceService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{
    let newRequest = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authService.getToken()
      }
    })

    return next.handle(newRequest);
  }
}
