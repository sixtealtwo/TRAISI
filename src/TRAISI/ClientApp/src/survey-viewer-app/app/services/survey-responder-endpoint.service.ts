import { EndpointFactory } from '../../../shared/services/endpoint-factory.service';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationService } from '../../../shared/services/configuration.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Observable } from 'rxjs';
import { SurveyQuestion, SurveyRespondent, ResponseTypes } from 'traisi-question-sdk';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderEndpointService extends EndpointFactory {
	private readonly _surveyResponseUrl: string = '/api/Responder';

	get surveyResponseUrl(): string {
		return this.configurations.baseUrl + this._surveyResponseUrl;
	}

	get responderSaveResponseUrl(): string {
		return this.configurations.baseUrl + this._surveyResponseUrl;
	}

	get responderSavedResponseUrl(): string {
		return this.configurations.baseUrl + this._surveyResponseUrl;
	}

	get responderAddSurveyGroupmemberUrl(): string {
		return this.configurations.baseUrl + this._surveyResponseUrl;
	}

	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	public getSaveResponseUrlEndpoint<T>(
		surveyId: number,
		questionId: number,
		respondentId: number,
		responseData: any
	): Observable<T> {
		let endpointUrl = `${
			this.responderSaveResponseUrl
		}/surveys/${surveyId}/questions/${questionId}/respondents/${respondentId}`;

		return this.http.post<T>(endpointUrl, JSON.stringify(responseData), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSaveResponseUrlEndpoint(surveyId, questionId, respondentId, responseData)
				);
			})
		);
	}

	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	public getSubmitSurveyResponseEndpoint<T>(
		surveyId: number,
		questionId: number,
		respondentId: number,
		responseData: any
	): Observable<T> {

		let endpointUrl = `${this.surveyResponseUrl}/${surveyId}/${questionId}`;

		return this.http.post<T>(endpointUrl, JSON.stringify(responseData), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSubmitSurveyResponseEndpoint(surveyId, questionId, respondentId, responseData)
				);
			})
		);
	}

	/**
	 * Returns the endpoint for retrieving survey questions of a particular survey view
	 * @param {number} surveyId
	 * @returns {Observable<T>}
	 */
	public getSavedResponseUrlEndpoint<T>(surveyId: number, questionId: number, respondentId: number): Observable<T> {
		let endpointUrl = `${
			this.responderSaveResponseUrl
		}/surveys/${surveyId}/questions/${questionId}/respondents/${respondentId}`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSavedResponseUrlEndpoint(surveyId, questionId, respondentId)
				);
			})
		);
	}

	/**
	 *
	 * @param questionIds
	 * @param respondentId
	 */
	public getListResponsesForQuestionsUrlEndpoint<T>(questionIds: number[], respondentId: number): Observable<T> {
		const endpointUrl = `${this.responderSaveResponseUrl}/questions/respondents/${respondentId}/responses`;

		const headers = this.getRequestHeaders();

		headers['params'] = {
			questionIds: questionIds
		};

		return this.http.get<T>(endpointUrl, headers).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getListResponsesForQuestionsUrlEndpoint(questionIds, respondentId)
				);
			})
		);
	}

	/**
	 *
	 */
	public getAddSurveyGroupMemberUrlEndpoint<T>(respondent: SurveyRespondent): Observable<T> {
		console.log(respondent);
		let endpointUrl = `${this.responderAddSurveyGroupmemberUrl}/respondents/groups`;

		return this.http.post<T>(endpointUrl, JSON.stringify(respondent), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getAddSurveyGroupMemberUrlEndpoint(respondent));
			})
		);
	}

	/**
	 *
	 * @param respondent
	 */
	public getUpdateSurveyGroupMemberUrlEndpoint<T>(respondent: SurveyRespondent): Observable<T> {
		let endpointUrl = `${this.responderAddSurveyGroupmemberUrl}/respondents/groups`;

		console.log(respondent);
		return this.http.put<T>(endpointUrl, JSON.stringify(respondent), this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getAddSurveyGroupMemberUrlEndpoint(respondent));
			})
		);
	}

	/**
	 *
	 */
	public getSurveyGroupMembersUrlEndpoint<T>(): Observable<T> {
		let endpointUrl = `${this.responderAddSurveyGroupmemberUrl}/respondents/groups`;

		return this.http.get<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getSurveyGroupMembersUrlEndpoint());
			})
		);
	}

	/**
	 *
	 * @param respondent
	 */
	public getRemoveSurveyGroupMemberUrlEndpoint<T>(respondent: SurveyRespondent): Observable<T> {
		let endpointUrl = `${this.responderAddSurveyGroupmemberUrl}/respondents/groups/${respondent.id}`;

		console.log('deleting');
		return this.http.delete<T>(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getRemoveSurveyGroupMemberUrlEndpoint(respondent));
			})
		);
	}

	/**
	 *
	 * @param surveyId
	 * @param type
	 */
	public getListSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any> {
		// surveys/{surveyId}/responses/types/{type}
		let endpointUrl = `${this.surveyResponseUrl}/surveys/${surveyId}/responses/types/${type}`;

		console.log(endpointUrl);
		return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () => this.getListSurveyResponsesOfType(surveyId, type));
			})
		);
	}

	/**
	 *
	 * @param currentQuestion
	 * @param respondentId
	 */
	public getSurveyNextQuestionUrlEndpoint(currentQuestion: number, respondentId: number): Observable<any> {
		// surveys/{surveyId}/responses/types/{type}
		let endpointUrl = `${
			this.surveyResponseUrl
		}questions/respondents/${respondentId}/questions/${currentQuestion}/next`;

		console.log(endpointUrl);
		return this.http.get(endpointUrl, this.getRequestHeaders()).pipe(
			catchError(error => {
				return this.handleError(error, () =>
					this.getSurveyNextQuestionUrlEndpoint(currentQuestion, respondentId)
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
