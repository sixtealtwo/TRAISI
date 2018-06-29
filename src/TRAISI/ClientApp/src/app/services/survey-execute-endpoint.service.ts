import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from './endpoint-factory.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CodeGenerator } from '../models/code-generator.model';

@Injectable({ providedIn: 'root' })
export class SurveyExecuteEndpointService extends EndpointFactory {
	private readonly _surveyExecuteUrl: string = '/api/surveyexecution';
	private readonly _surveyExecuteGroupCodeUrl: string = '/api/surveyexecution/groupcode';

	get surveyExecuteUrl() {
		return this.configurations.baseUrl + this._surveyExecuteUrl;
	}
	get groupExecuteGroupCodeUrl() {
		return this.configurations.baseUrl + this._surveyExecuteGroupCodeUrl;
	}

	/**
	 * @param  {HttpClient} http
	 * @param  {ConfigurationService} configurations
	 * @param  {Injector} injector
	 */
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
		super(http, configurations, injector);
	}

	public getSurveyShortCodesEndpoint<T>(id: number, page?: number, pageSize?: number): Observable<T> {
		const endpointUrl =
			page && pageSize ? `${this.surveyExecuteUrl}/${id}/${page}/${pageSize}` : `${this.surveyExecuteUrl}/${id}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyShortCodesEndpoint(page, pageSize));
			})
		);
	}

	public getSurveyGroupCodesEndpoint<T>(id: number, page?: number, pageSize?: number): Observable<T> {
		const endpointUrl =
			page && pageSize
				? `${this.surveyExecuteUrl}/${id}/groupcode/${page}/${pageSize}`
				: `${this.surveyExecuteUrl}/${id}/groupcode`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyGroupCodesEndpoint(id));
			})
		);
	}

	public getCreateSurveyShortCodesEndpoint<T>(codeGenParams: CodeGenerator): Observable<T> {
		const endpointUrl = this.surveyExecuteUrl;

		return this.http.post<T>(endpointUrl, JSON.stringify(codeGenParams), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getCreateSurveyShortCodesEndpoint(codeGenParams));
			})
		);
	}

	/**
	 * @param  {Survey} survey
	 * @returns Observable
	 */
	public getCreateSurveyGroupCodesEndpoint<T>(codeGenParams: CodeGenerator): Observable<T> {
		const endpointUrl = `${this.surveyExecuteUrl}/groupcode`;

		return this.http.post<T>(endpointUrl, JSON.stringify(codeGenParams), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getCreateSurveyGroupCodesEndpoint(codeGenParams));
			})
		);
	}
}
