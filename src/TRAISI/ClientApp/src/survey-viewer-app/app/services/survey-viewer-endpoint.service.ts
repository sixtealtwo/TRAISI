import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';
import { SurveyViewType } from '../models/survey-view-type.enum';
import { EndpointFactory } from '../../../shared/services/endpoint-factory.service';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { SurveyViewPage } from '../models/survey-view-page.model';

@Injectable()
export class SurveyViewerEndpointService extends EndpointFactory {
	private readonly _surveyViewQuestionsUrl: string = '/api/SurveyViewer';
	private readonly _surveyViewerUrl: string = '/api/SurveyViewer';

	public get surveyViewQuestionsUrl(): string {
		return this.configurations.baseUrl + '/' + this._surveyViewQuestionsUrl;
	}

	get surveyViewQuestionConfiguration(): string {
		return this.configurations.baseUrl + '/' + this._surveyViewQuestionsUrl;
	}

	get surveyViewerUrl(): string {
		return this.configurations.baseUrl + '/' + this._surveyViewerUrl;
	}

	private get getSurveyViewerWelcomeViewUrl(): string {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/welcome';
	}

	private get getSurveyViewerStartSurveyUrl(): string {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/start';
	}

	private get getSurveyViewerTermsAndConditionsUrl(): string {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl;
	}

	private get getDefaultSurveyViewUrl(): string {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/view';
	}

	private get getSurveyViewerRespondentPageQuestionsUrl(): string {
		return this.configurations.baseUrl + '' + this._surveyViewerUrl + '/viewer';
	}

	private get getSurveyViewPagesUrl(): string {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/surveys';
	}

	private get getSurveyViewQuestionOptionsUrl(): string {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/surveys';
	}

	private get getSurveyIdFromCodeUrl(): string {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/codes';
	}

	private get getSurveyStylesUrl(): string {
		return this.configurations.baseUrl + this._surveyViewerUrl + '/styles';
	}

	/**
	 *
	 * @param surveyId
	 * @param shortcode
	 */
	public getSurveyIdFromCodeEndpoint<T>(code: string): Observable<T> {
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
	public getSurveyViewPagesEndpoint<SurveyViewPage>(
		surveyId: number,
		viewType?: SurveyViewType
	): Observable<SurveyViewPage> {
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
	public getSurveyViewerRespondentPageQuestionsEndpoint<T>(
		surveyId: number,
		pageNumber: number,
		language?: string
	): Observable<T> {
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

	public getSurveyStylesEndpoint<T>(surveyId: number): Observable<T> {
		let endpointUrl = `${this.getSurveyStylesUrl}/${surveyId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders('text')).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyStylesEndpoint(surveyId));
			})
		);
	}

	public getSurveyViewerTermsAndConditionsEndpoint<T>(
		surveyId: number,
		viewType?: SurveyViewType,
		language?: string
	): Observable<T> {
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
	public getSurveyViewerWelcomeViewEndpoint<T>(surveyName: string): Observable<T> {
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
	public getSurveyViewerStartSurveyEndpoint<T>(surveyId: number, shortcode: string = null): Observable<T> {
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
	public getDefaultSurveyViewEndpoint<T>(surveyId: number, language: string = 'en'): Observable<T> {
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
	 * @param query
	 */
	public getQuestionOptionsEndpoint<T>(questionId: number, query: string = null): Observable<T> {
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
	public getSurveyViewQuestionConfigurationEndpoint<T>(questionId: number): Observable<T> {
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
	public getSurveyViewQuestionOptionsEndpoint<SurveyViewQuestionOption>(
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
	public getSurveyViewQuestionsEndpoint<T>(surveyId: number): Observable<T> {
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
	public getSurveyViewQuestionEndpoint<T>(surveyId: number, questionIndex: number): Observable<T> {
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
