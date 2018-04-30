
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';
import { EndpointFactory } from './endpoint-factory.service';

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

	public listSurveysEndpoint<T>(page?: number, pageSize?: number): Observable<T>
	{
		const endpointUrl = page && pageSize ? `${this._surveysUrl}/${page}/${pageSize}` : this._surveysUrl;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders())
			.catch(error => {
				return this.handleError(error, () => this.listSurveysEndpoint(page, pageSize));
			});
	}
}
