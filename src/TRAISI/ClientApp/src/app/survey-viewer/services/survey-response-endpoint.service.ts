import { EndpointFactory } from '../../services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';

@Injectable()
export class SurveyResponseEndpointService extends EndpointFactory {
	private readonly _surveyResponseUrl: string = '/api/survey-response';

	get surveyResponseUrl() {
		return this.configurations.baseUrl + '/' + this._surveyResponseUrl;
	}

	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	getSubmitSurveyResponseEndpoint<T>(
		surveyId: number,
		questionId: number,
		responseData: any
	): Observable<T> {
		let endpointUrl = `${this.surveyResponseUrl}/${surveyId}/${questionId}`;

		return this.http
			.post<T>(
				endpointUrl,
				JSON.stringify(responseData),
				this.getRequestHeaders()
			)
			.pipe(
				catchError(error => {
					return this.handleError(error, () =>
						this.getSubmitSurveyResponseEndpoint(
							surveyId,
							questionId,
							responseData
						)
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
	constructor(
		http: HttpClient,
		configurations: ConfigurationService,
		injector: Injector
	) {
		super(http, configurations, injector);
	}
}
