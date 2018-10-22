import { Injectable } from '@angular/core';
import {
	SurveyResponder,
	SurveyQuestion,
	OnSaveResponseStatus,
	ResponseTypes,
	ResponseData,
	ResponseValue,
	SurveyRespondent
} from '../../../../../../TRAISI.SDK/Module/src';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';
import { Observable } from 'rxjs';
import { SurveyViewerService } from './survey-viewer.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService implements SurveyResponder {
	public id: number;
	/**
	 *
	 *
	 * @private
	 * @param {*} data
	 * @param {number} surveyId
	 * @param {number} questionId
	 * @returns
	 * @memberof SurveyResponderService
	 */
	private saveResponse(data: any, surveyId: number, questionId: number, respondentId: number): Observable<{}> {
		console.log('saving ' + respondentId);
		return this._surveyResponseEndpointService.getSaveResponseUrlEndpoint(surveyId, questionId, respondentId, data);
	}

	/**
	 *
	 *
	 * @param {TRAISI.SurveyQuestion<any>} questionComponent
	 * @param {number} surveyId
	 * @param {number} questionId
	 * @memberof SurveyResponderService
	 */
	public registerQuestion(
		questionComponent: SurveyQuestion<ResponseTypes> | SurveyQuestion<ResponseTypes[]>,
		surveyId: number,
		questionId: number,
		respondentId: number
	): void {
		questionComponent.response.subscribe(
			(value: ResponseData<ResponseTypes | ResponseTypes[]>) => {
				this.handleResponse(questionComponent, value, surveyId, questionId, respondentId);
			},
			error => {
				console.log('An error occurred subscribing to ' + questionComponent + ' responses');
			}
		);
	}

	/**
	 * Returns the previously saved response for the active user for the specified survey id and question id
	 * @param surveyId
	 * @param questionId
	 */
	public getSavedResponse(
		surveyId: number,
		questionId: number,
		respondentId: number
	): Observable<ResponseValue<any>> {
		return this._surveyResponseEndpointService.getSavedResponseUrlEndpoint<ResponseValue<any>>(
			surveyId,
			questionId,
			respondentId
		);
	}

	/**
	 *
	 *
	 * @private
	 * @param {*} respone
	 * @memberof SurveyResponderService
	 */
	private handleResponse(
		questionComponent:
			| SurveyQuestion<ResponseTypes>
			| SurveyQuestion<ResponseTypes[]>
			| SurveyQuestion<any>
			| OnSaveResponseStatus,
		response: ResponseData<ResponseTypes | ResponseTypes[]>,
		surveyId: number,
		questionId: number,
		respondentId: number
	): void {
		console.log(respondentId);
		if (response instanceof Array) {
			this.saveResponse({ values: response }, surveyId, questionId, respondentId).subscribe(
				value => {
					this.onSavedResponse(questionComponent, value);
				},
				error => {
					console.log(error);
				}
			);
		} else {
			this.saveResponse(response, surveyId, questionId, respondentId).subscribe(
				value => {
					this.onSavedResponse(questionComponent, value);
				},
				error => {
					console.log(error);
				}
			);
		}
	}

	/**
	 *
	 */
	private onSavedResponse(
		questionComponent:
			| SurveyQuestion<ResponseTypes>
			| SurveyQuestion<ResponseTypes[]>
			| SurveyQuestion<any>
			| OnSaveResponseStatus,
		value: any
	): void {
		if (Object.getPrototypeOf(questionComponent).hasOwnProperty('onResponseSaved')) {
			(<OnSaveResponseStatus>questionComponent).onResponseSaved(value);
		}
	}

	/**
	 *
	 * @param currentQuestionId
	 * @param respondentId
	 */
	private getSurveyNextQuestion(currentQuestionId: number, respondentId: number): Observable<any> {
		return this._surveyResponseEndpointService.getSurveyNextQuestionUrlEndpoint(currentQuestionId, respondentId);
	}

	/**
	 *
	 * @param respondent
	 */
	public addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getAddSurveyGroupMemberUrlEndpoint(respondent);
	}

	public getSurveyGroupMembers(): Observable<{}> {
		return this._surveyResponseEndpointService.getSurveyGroupMembersUrlEndpoint();
	}

	/**
	 *
	 * @param respondent
	 */
	public removeSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getRemoveSurveyGroupMemberUrlEndpoint(respondent);
	}

	/**
	 *
	 * @param respondent
	 */
	public updateSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getUpdateSurveyGroupMemberUrlEndpoint(respondent);
	}

	/**
	 *
	 * @param surveyId
	 * @param type
	 */
	public listSurveyResponsesOfType(surveyId: number, type: ResponseTypes): Observable<any> {
		return this._surveyResponseEndpointService.getListSurveyResponsesOfType(surveyId, type);
	}

	/**
	 *Creates an instance of SurveyResponderService.
	 * @param {SurveyResponderEndpointService} _surveyResponseEndpointService
	 * @memberof SurveyResponderService
	 */
	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {}
}
