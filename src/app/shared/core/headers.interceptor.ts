import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  _Router = inject(Router)
  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("the request : ", request);



    // اذا كان المستخدم مسجل الدخول اضف الهيدر الي الطلبات
    if (localStorage.getItem('userToken') !== null) {
      
      let modifiedRequest = request.clone({
        setHeaders: { 'Authorization': localStorage.getItem('userToken')! }
      })

      return next.handle(modifiedRequest).pipe(

        // HttpErrorResponse هنا عشان اشوف تفاصيل الايرور ريسبونس
        catchError((err) => {
          console.log("interceptor", err);

          // اذا كان هناك خطأ 401 متعلق بالتوكن و تسجيل الدخول
          if (err.status == 401) {
            this._Router.navigate(['login'])
          }

          return throwError(() => { return err })
        }),

        // فاينلايز اللي جواها بيشتغل لما الريسبونس يكتمل بالكامل
        finalize(()=>{
          console.log('response is arrived fully - observable done ');
        })

      );
    }


    // اذا لم يكن مسجل ليس لدينا توكن و لن يتم اضافة هيدر
    else {
      return next.handle(request)
    }

  }
}
