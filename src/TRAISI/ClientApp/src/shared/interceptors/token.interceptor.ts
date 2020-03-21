import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: AuthService) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (this.auth.isLoggedIn) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.auth.accessToken}`
                }
            });
            return next.handle(request);
        } else {
            return next.handle(request);
        }
    }
}
