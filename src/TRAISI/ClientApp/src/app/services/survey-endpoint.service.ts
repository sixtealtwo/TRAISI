
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from './endpoint-factory.service';
import { Survey } from '../models/survey.model';

@Injectable()
export class SurveyEndpointService extends EndpointFactory 
{

	private readonly _surveysUrl: string = '/api/survey-management/surveys';

	/**
	 * @param  {HttpClient} http
	 * @param  {ConfigurationService} configurations
	 * @param  {Injector} injector
	 */
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {

		super(http, configurations, injector);
	}

	public getListSurveysEndpoint<T>(page?: number, pageSize?: number): Observable<T>
	{
		const endpointUrl = page && pageSize ? `${this._surveysUrl}/${page}/${pageSize}` : this._surveysUrl;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getListSurveysEndpoint(page, pageSize));
			});
	}
	/**
	 * @param  {any} survey
	 * @returns Observable
	 */
	public getNewSurveyEndpoint<T>(survey:any): Observable<T>
	{
		const endpointUrl = this._surveysUrl;

		return this.http.post<T>(endpointUrl,  JSON.stringify(survey), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getNewSurveyEndpoint(survey));
			});
	}

	/**
	 * @param  {any} survey
	 * @returns Observable
	 */
	public getEditSurveyEndpoint<T>(survey: Survey): Observable<T>
	{
		const endpointUrl = this._surveysUrl;

		return this.http.put<T>(endpointUrl,  JSON.stringify(survey), this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getEditSurveyEndpoint(survey));
			});
	}

	/**
	 * @param  {any} survey
	 * @returns Observable
	 */
	public getDeleteSurveyEndpoint<T>(survey: Survey): Observable<T>
	{
		const endpointUrl = `${this._surveysUrl}/${survey.id}`;

		return this.http.delete<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.getDeleteSurveyEndpoint(survey));
			});
	}





}
