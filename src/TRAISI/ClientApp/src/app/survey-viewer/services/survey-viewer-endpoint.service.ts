import { EndpointFactory } from 'app/services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from 'app/services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs/index';

@Injectable()
export class SurveyViewerEndpointService extends EndpointFactory {
	private readonly _surveyViewQuestionsUrl: string = '/api/survey-viewer/questions';

	get surveyViewQuestionsUrl() {
		return this.configurations.baseUrl + '/' + this._surveyViewQuestionsUrl;
	}

	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	getSurveyViewQuestionsEndpoint<T>(surveyId: number): Observable<T> {
		let endpointUrl = `${this.surveyViewQuestionsUrl}/${surveyId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSurveyViewQuestionsEndpoint(surveyId)
				);
			})
		);
	}

	/**
	 * Returns a particular question specified by the passed index of a particular survey view.
	 * @param {number} surveyId
	 * @param {number} questionIndex
	 * @returns {Observable<T>}
	 */
	getSurveyViewQuestionEndpoint<T>(
		surveyId: number,
		questionIndex: number
	): Observable<T> {
		let endpointUrl = `${
			this.surveyViewQuestionsUrl
		}/${surveyId}/${questionIndex}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSurveyViewQuestionEndpoint(surveyId, questionIndex)
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
