import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';
import { SurveyViewType } from '../models/survey-view-type.enum';
import { EndpointFactory } from 'shared/services/endpoint-factory.service';
import { ConfigurationService } from 'shared/services/configuration.service';
import { SurveyViewPage } from '../models/survey-view-page.model';

@Injectable()
export class SurveyViewerEndpointService extends EndpointFactory {
	private readonly _surveyViewQuestionsUrl: string = '/api/SurveyViewer';
	private readonly _surveyViewerUrl: string = '/api/SurveyViewer';

	get surveyViewQuestionsUrl() {
		return this.configurations.baseUrl + '/' + this._surveyViewQuestionsUrl;
	}

	get surveyViewQuestionConfiguration() {
		return this.configurations.baseUrl + '/' + this._surveyViewQuestionsUrl;
	}

	get surveyViewerUrl() {
		return this.configurations.baseUrl + '/' + this._surveyViewerUrl;
	}

	private get getSurveyViewerWelcomeViewUrl() {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/welcome';
	}

	private get getSurveyViewerStartSurveyUrl() {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/start';
	}

	private get getSurveyViewerTermsAndConditionsUrl() {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl;
	}

	private get getDefaultSurveyViewUrl() {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/view';
	}

	private get getSurveyViewerRespondentPageQuestionsUrl() {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/viewer';
	}

	private get getSurveyViewPagesUrl() {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/surveys';
	}

	private get getSurveyViewQuestionOptionsUrl() {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/surveys';
	}

	private get getSurveyIdFromCodeUrl() {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/codes';
	}


		/**
	 *
	 * @param surveyId
	 * @param shortcode
	 */
	getSurveyIdFromCodeEndpoint<T>(code: string): Observable<T> {
		let endpointUrl = `${this.getSurveyIdFromCodeUrl}/${code}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyIdFromCodeEndpoint(code));
			})
		);
	}

	/**
	 *
	 * @param surveyId
	 * @param pageNumber
	 * @param language
	 */
	// tslint:disable-next-line:no-shadowed-variable
	public getSurveyViewPagesEndpoint<SurveyViewPage>(surveyId: number, viewType?: SurveyViewType) {
		let endpointUrl = `${this.getSurveyViewPagesUrl}/${surveyId}?viewType=${viewType}`;

		return this.http.get<SurveyViewPage[]>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyViewPagesEndpoint(surveyId, viewType));
			})
		);
	}

	/**
	 *
	 * @param surveyId
	 * @param pageNumber
	 * @param language
	 */
	public getSurveyViewerRespondentPageQuestionsEndpoint<T>(surveyId: number, pageNumber: number, language?: string) {
		let endpointUrl = `${
			this.getSurveyViewerRespondentPageQuestionsUrl
		}/${surveyId}/page/${pageNumber}?language=${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSurveyViewerRespondentPageQuestionsEndpoint(surveyId, pageNumber, language)
				);
			})
		);
	}

	public getSurveyViewerTermsAndConditionsEndpoint<T>(
		surveyId: number,
		viewType?: SurveyViewType,
		language?: string
	) {
		let endpointUrl = `${this.getSurveyViewerTermsAndConditionsUrl}/${surveyId}/terms/${viewType}/${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSurveyViewerTermsAndConditionsEndpoint(surveyId, viewType, language)
				);
			})
		);
	}

	/**
	 *
	 * @param surveyName
	 */
	getSurveyViewerWelcomeViewEndpoint<T>(surveyName: string): Observable<T> {
		let endpointUrl = `${this.getSurveyViewerWelcomeViewUrl}/${surveyName}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyViewerWelcomeViewEndpoint(surveyName));
			})
		);
	}

	/**
	 *
	 * @param surveyId
	 * @param shortcode
	 */
	getSurveyViewerStartSurveyEndpoint<T>(surveyId: number, shortcode: string = null): Observable<T> {
		let endpointUrl = `${this.getSurveyViewerStartSurveyUrl}/${surveyId}/${shortcode}`;

		console.log(this.getRequestHeaders());
		return this.http.post<T>(endpointUrl, '', this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyViewerStartSurveyEndpoint(surveyId, shortcode));
			})
		);
	}

	/**
	 *
	 * @param surveyId
	 * @param language
	 */
	getDefaultSurveyViewEndpoint<T>(surveyId: number, language: string = 'en'): Observable<T> {
		let endpointUrl = `${this.getDefaultSurveyViewUrl}/${surveyId}/${language}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getDefaultSurveyViewEndpoint(surveyId, language));
			})
		);
	}

	/**
	 *
	 * @param questionId
	 */
	getQuestionOptionsEndpoint<T>(questionId: number, query: string = null): Observable<T> {
		let endpointUrl = `${this.surveyViewQuestionConfiguration}/question-options/${questionId}/query`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getQuestionOptionsEndpoint(questionId, query));
			})
		);
	}

	/**
	 *
	 * @param questionId
	 */
	getSurveyViewQuestionConfigurationEndpoint<T>(questionId: number): Observable<T> {
		let endpointUrl = `${this.surveyViewQuestionConfiguration}/${questionId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyViewQuestionsEndpoint(questionId));
			})
		);
	}

	/**
	 *
	 * @param surveyId
	 * @param questionId
	 * @param language
	 * @param query
	 */
	getSurveyViewQuestionOptionsEndpoint<SurveyViewQuestionOption>(
		surveyId: number,
		questionId: number,
		language?: string,
		query?: string
	): Observable<SurveyViewQuestionOption[]> {
		let endpointUrl = `${
			this.getSurveyViewQuestionOptionsUrl
		}/${surveyId}/questions/${questionId}/options?language=${language}&query=${query}`;

		return this.http.get<SurveyViewQuestionOption>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSurveyViewQuestionOptionsEndpoint(surveyId, questionId, language, query)
				);
			})
		);
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
				return this.handleError(error, () => this.getSurveyViewQuestionsEndpoint(surveyId));
			})
		);
	}

	/**
	 * Returns a particular question specified by the passed index of a particular survey view.
	 * @param {number} surveyId
	 * @param {number} questionIndex
	 * @returns {Observable<T>}
	 */
	getSurveyViewQuestionEndpoint<T>(surveyId: number, questionIndex: number): Observable<T> {
		let endpointUrl = `${this.surveyViewQuestionsUrl}/${surveyId}/${questionIndex}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyViewQuestionEndpoint(surveyId, questionIndex));
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
