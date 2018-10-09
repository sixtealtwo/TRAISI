import { Injectable } from '@angular/core';
import {
	SurveyResponder,
	SurveyQuestion,
	OnSaveResponseStatus,
	ResponseTypes,
	ResponseData,
	ResponseValue,
	SurveyRespondent
} from 'traisi-question-sdk';
import { SurveyResponderEndpointService } from './survey-responder-endpoint.service';
import { Observable } from 'rxjs';
import { SurveyViewerService } from './survey-viewer.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService implements SurveyResponder {
	id: number;
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
	private saveResponse(data: any, surveyId: number, questionId: number): Observable<{}> {
		return this._surveyResponseEndpointService.getSaveResponseUrlEndpoint(surveyId, questionId, data);
	}

	/**
	 *
	 *
	 * @param {TRAISI.SurveyQuestion<any>} questionComponent
	 * @param {number} surveyId
	 * @param {number} questionId
	 * @memberof SurveyResponderService
	 */
	public registerQuestion(questionComponent: SurveyQuestion<any>, surveyId: number, questionId: number) {
		questionComponent.response.subscribe(
			(value: ResponseData<any>) => {
				this.handleResponse(questionComponent, value, surveyId, questionId);
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
	public getSavedResponse(surveyId: number, questionId: number): Observable<ResponseValue<any>> {
		return this._surveyResponseEndpointService.getSavedResponseUrlEndpoint<ResponseValue<any>>(
			surveyId,
			questionId
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
		questionComponent: SurveyQuestion<ResponseTypes.String> | OnSaveResponseStatus,
		response: ResponseData<any>,
		surveyId: number,
		questionId: number
	) {
		this.saveResponse(<string>response, surveyId, questionId).subscribe(
			value => {
				if (Object.getPrototypeOf(questionComponent).hasOwnProperty('onResponseSaved')) {
					(<OnSaveResponseStatus>questionComponent).onResponseSaved(value);
				}
			},
			error => {
				console.log(error);
			}
		);
	}

	/**
	 *
	 */
	public addSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		console.log('in add survey group member');
		return this._surveyResponseEndpointService.getAddSurveyGroupMemberUrlEndpoint(respondent);
	}

	public getSurveyGroupMembers(): Observable<{}> {
		return this._surveyResponseEndpointService.getSurveyGroupMembersUrlEndpoint();
	}
	public removeSurveyGroupMember(respondent: SurveyRespondent): Observable<{}> {
		return this._surveyResponseEndpointService.getRemoveSurveyGroupMemberUrlEndpoint(respondent);
	}

	/**
	 *Creates an instance of SurveyResponderService.
	 * @param {SurveyResponderEndpointService} _surveyResponseEndpointService
	 * @memberof SurveyResponderService
	 */
	constructor(private _surveyResponseEndpointService: SurveyResponderEndpointService) {}
}
