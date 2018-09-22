import { EndpointFactory } from 'shared/services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'shared/services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';
import { TRAISI } from 'traisi-question-sdk';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderEndpointService extends EndpointFactory {
	private readonly _surveyResponseUrl: string = '/api/Responder';

	get surveyResponseUrl() {
		return this.configurations.baseUrl + this._surveyResponseUrl;
	}

	get responderSaveResponseUrl() {
		return this.configurations.baseUrl + this._surveyResponseUrl;
	}

	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	public getSaveResponseUrlEndpoint<T>(surveyId: number, questionId: number, responseData: any): Observable<T> {
		let endpointUrl = `${this.responderSaveResponseUrl}/surveys/${surveyId}/questions/${questionId}`;

		return this.http.post<T>(endpointUrl, JSON.stringify(responseData), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSaveResponseUrlEndpoint(surveyId, questionId, responseData)
				);
			})
		);
	}



	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	getSubmitSurveyResponseEndpoint<T>(surveyId: number, questionId: number, responseData: any): Observable<T> {
		console.log(this.configurations.baseUrl);
		let endpointUrl = `${this.surveyResponseUrl}/${surveyId}/${questionId}`;

		return this.http.post<T>(endpointUrl, JSON.stringify(responseData), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSubmitSurveyResponseEndpoint(surveyId, questionId, responseData)
				);
			})
		);
	}

	/**
	 * Service constructor
	 * @param http
	 * @param configurations
	 * @param injector
	 */
	constructor(http: HttpClient, configurations: ConfigurationService, injector: Injector) {
		super(http, configurations, injector);
	}
}
