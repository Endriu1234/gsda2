import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpinnerInterceptor } from '../tools/interceptors/spinner.interceptor';

export const httpInterceptProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true }
]