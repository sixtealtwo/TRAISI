import {Observable, Subject} from 'rxjs';

import {switchMap, catchError, mergeMap} from 'rxjs/operators';
import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';


import {throwError as observableThrowError} from 'rxjs/internal/observable/throwError';
import { AuthService } from '../../../shared/services/auth.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';

@Injectable()
export class SureyViewerEndpointFactory {
	public readonly apiVersion: string = '1';

	private readonly _loginUrl: string = '/connect/token';

	protected get loginUrl(): string {
		return this.configurations.baseUrl + this._loginUrl;
	}

	protected taskPauser: Subject<any>;
	protected isRefreshingLogin: boolean;
	protected lastCall: string = '';

	private _authService: AuthService;

	protected get authService(): any {
		if (!this._authService) {
			this._authService = this.injector.get(AuthService);
		}

		return this._authService;
	}



	/**
	 *Creates an instance of EndpointFactory.
	 * @param {HttpClient} http
	 * @param {ConfigurationService} configurations
	 * @param {Injector} injector
	 * @memberof EndpointFactory
	 */
	constructor(
		protected http: HttpClient,
		protected configurations: ConfigurationService,
		private injector: Injector
	) {
	}

	/**
	 *
	 * @param userName
	 * @param password
	 */
	public getLoginEndpoint<T>(userName: string, password: string): Observable<T> {
		let header = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});

		let params = new HttpParams()
			.append('username', userName)
			.append('password', password)
			.append('grant_type', 'password')
			.append('scope', 'openid email phone profile offline_access roles')
			.append('resource', window.location.origin);

		let requestBody = params.toString();

		return this.http.post<T>(this.loginUrl, requestBody, {headers: header});
	}



	/**
	 *
	 *
	 * @template T
	 * @returns {Observable<T>}
	 * @memberof EndpointFactory
	 */
	public getRefreshLoginEndpoint<T>(): Observable<T> {
		let header = new HttpHeaders({
			Authorization: 'Bearer ' + this.authService.accessToken,
			'Content-Type': 'application/x-www-form-urlencoded'
		});

		let params = new HttpParams()
			.append('refresh_token', this.authService.refreshToken)
			.append('grant_type', 'refresh_token')
			.append('scope', 'openid email phone profile offline_access roles');

		let requestBody = params.toString();

		return this.http.post<T>(this.loginUrl, requestBody, {headers: header}).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getRefreshLoginEndpoint<T>());
			})
		);
	}


	/**
	 *
	 *
	 * @protected
	 * @param {*} [rType='json']
	 * @returns {({ headers: HttpHeaders | { [header: string]: string | string[] }; responseType: any })}
	 * @memberof EndpointFactory
	 */
	protected getRequestHeaders(
		rType: any = 'json'
	): { headers: HttpHeaders | { [header: string]: string | string[] }; responseType: any } {
		if (this.authService.currentUser != null  ) {
			let headers = new HttpHeaders({
				Authorization: 'Bearer ' + this.authService.accessToken,
				'Content-Type': 'application/json',
				Accept: `application/vnd.iman.v${
					this.apiVersion
					}+json, application/json, text/plain, */*`,
				'App-Version': ConfigurationService.appVersion,
				'Survey-Id': String(this.authService.currentSurveyUser.surveyId),
				Shortcode: this.authService.currentSurveyUser.shortcode,
				'Respondent-Id': this.authService.currentSurveyUser.id
			});

			return {headers: headers, responseType: rType};
		}
	}


	/**
	 *
	 *
	 * @protected
	 * @param {*} [rType='json']
	 * @returns {({ headers: HttpHeaders | { [header: string]: string | string[] }; responseType: any })}
	 * @memberof EndpointFactory
	 */
	protected getSurveyViewerRequestHeaders(
		rType: any = 'json'
	): { headers: HttpHeaders | { [header: string]: string | string[] }; responseType: any } {
		if (this.authService.currentUser != null && this.authService.currentUser.roles.includes('respondent') ) {
			let headers = new HttpHeaders({
				Authorization: 'Bearer ' + this.authService.accessToken,
				'Content-Type': 'application/json',
				Accept: `application/vnd.iman.v${
					this.apiVersion
					}+json, application/json, text/plain, */*`,
				'App-Version': ConfigurationService.appVersion,
				'Survey-Id': String(this.authService.currentSurveyUser.surveyId),
				Shortcode: this.authService.currentSurveyUser.shortcode,
				'Respondent-Id': this.authService.currentSurveyUser.id
			});

			return {headers: headers, responseType: rType};
		}
	}

	/**
	 *
	 * @param error
	 * @param continuation
	 */
	protected handleError(error: any, continuation: () => Observable<any>): Observable<any> {
		if (error.status === 401 && this.lastCall !== error.url) {
			this.lastCall = error.url;
			if (this.isRefreshingLogin) {
				return this.pauseTask(continuation);
			}

			this.isRefreshingLogin = true;

			return this.authService.refreshLogin().pipe(
				mergeMap(data => {
					this.isRefreshingLogin = false;
					this.resumeTasks(true);

					return continuation();
				}),
				catchError(refreshLoginError => {
					this.isRefreshingLogin = false;
					this.resumeTasks(false);

					if (
						refreshLoginError.status === 401 ||
						(refreshLoginError.url &&
							refreshLoginError.url
								.toLowerCase()
								.includes(this.loginUrl.toLowerCase()))
					) {
						this.authService.reLogin();
						return observableThrowError('session expired');
					} else {
						return observableThrowError(refreshLoginError || 'server error');
					}
				})
			);
		}

		if (error.url && error.url.toLowerCase().includes(this.loginUrl.toLowerCase())) {
			this.authService.reLogin();

			return observableThrowError(
				error.error && error.error.error_description
					? `session expired (${error.error.error_description})`
					: 'session expired'
			);
		} else {
			return observableThrowError(error);
		}
	}

	/**
	 *
	 * @param continuation
	 */
	protected pauseTask(continuation: () => Observable<any>): Observable<any> {
		if (!this.taskPauser) {
			this.taskPauser = new Subject();
		}

		return this.taskPauser.pipe(
			switchMap(continueOp => {
				return continueOp ? continuation() : observableThrowError('session expired');
			})
		);
	}

	/**
	 *
	 * @param continueOp
	 */
	protected resumeTasks(continueOp: boolean): void {
		setTimeout(() => {
			if (this.taskPauser) {
				this.taskPauser.next(continueOp);
				this.taskPauser.complete();
				this.taskPauser = null;
			}
		});
	}
}
