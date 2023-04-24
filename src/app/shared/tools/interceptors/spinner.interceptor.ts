import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SpinnerService } from '../../spinner/spinner.service';
import { SpinnerType, TYPE_OF_SPINNER } from './http-context-params';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    if (SpinnerType.FullScreen === request.context.get(TYPE_OF_SPINNER)) {
      this.spinnerService.requestStarted();
      return this.handleRequest(request, next, this.spinnerService);
    }

    return next.handle(request);
  }

  handleRequest(request: HttpRequest<unknown>, next: HttpHandler, spinnerService: SpinnerService): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap ({
        next: (event) => {
          if (event instanceof HttpResponse) {
            spinnerService.requestEnded();
          }
        },
        error: (error: HttpErrorResponse) => {
          spinnerService.resetSpinner();
          throw error;
        }
      }),
    );
  }
}
