import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import { SurveyViewerSession } from 'app/services/survey-viewer-session.service';
import { AuthService } from 'shared/services/auth.service';
import { SurveyViewerSessionData } from 'app/models/survey-viewer-session-data.model';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	/**
	 *Creates an instance of AuthInterceptor.
	 * @param {SurveyViewerSession} _session
	 * @memberof AuthInterceptor
	 */
	public constructor(private _session: SurveyViewerSession, private _auth: AuthService) {}

	/**
	 *
	 *
	 * @param {HttpRequest<any>} req
	 * @param {HttpHandler} next
	 * @returns {Observable<HttpEvent<any>>}
	 * @memberof AuthInterceptor
	 */
	public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authReq = req.clone({});
		return next.handle(authReq);
	}
}
