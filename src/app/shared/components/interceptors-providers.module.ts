import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from '../tools/interceptors/spinner.interceptor';
import { AuthInterceptor } from 'src/app/auth/auth-interceptor';

export const httpInterceptProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
]