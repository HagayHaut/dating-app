import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private _toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response) {
          
          switch (response.status) {
            case 400:
              if (response.error.errors) {
                const errors = response.error.errors;
                this.throwValidationErrors(errors);
              } else {
                this._toastr.error(response.error, `${response.status}`)
              }
              break;
            case 401:
              this._toastr.error('Unauthorized', `${response.status}`);
              break;
            case 404:
              this._router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { error: response.error } };
              this._router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this._toastr.error('Something unexpected went wrong');
              console.log(response);
          }
        }

        throw response;
      }),
    );
  }

  throwValidationErrors(errors: {[key: string]: string[]}): void {
    const modelStateErrors: string[] = [];
    for (const key in errors) {
      modelStateErrors.push(...errors[key]);
    }
    throw modelStateErrors;
  }
}
