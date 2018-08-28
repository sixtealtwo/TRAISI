import { Injectable } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/of';

import { SurveyStart } from '../models/survey-start.model';
import { SurveyViewType } from '../models/survey-view-type.enum';
import { SurveyViewTermsModel } from '../models/survey-view-terms.model';
import { AuthService } from 'admin-app/app/services/auth.service';
import { User } from 'admin-app/app/models/user.model';
import { SurveyViewer, QuestionConfiguration} from 'traisi-question-sdk';
import { QuestionOption } from 'traisi-question-sdk';
import {L} from "@angular/core/src/render3";
@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService implements SurveyViewer {


	configurationData: Subject<QuestionConfiguration[]>;
	options: Subject<QuestionOption[]>;

	/**
	 *
	 * @param _surveyViewerEndpointService
	 * @param authService
	 */
	constructor(private _surveyViewerEndpointService: SurveyViewerEndpointService,
		private authService: AuthService) {
		this._activeSurveyId = -1;
		this.restoreStatus();
		this.configurationData = new Subject<QuestionConfiguration[]>();
		this.options = new Subject<QuestionOption[]>();
	}

	private _activeSurveyId: number;

	/**
	 * The ID of the currently active survey
	 */
	public get activeSurveyId() {
		return this._activeSurveyId;
	}

	/**
	 * Sets the currently active survey id.
	 */
	public set activeSurveyId(id: number) {
		this._activeSurveyId = id;
	}

	/**
	 *
	 * @param surveyId
	 * @param language
	 */
	public getDefaultSurveyView(surveyId: number, language?: string): Observable<SurveyViewer> {
		return this._surveyViewerEndpointService.getDefaultSurveyViewEndpoint(surveyId, language);
	}

	/**
	 *
	 * @param surveyName
	 */
	public getWelcomeView(surveyName: string): Observable<SurveyStart> {
		return this._surveyViewerEndpointService.getSurveyViewerWelcomeViewEndpoint(surveyName);
	}

	/**
	 *
	 * @param surveyId
	 * @param page
	 * @param language
	 */
	public getSurveyViewerRespondentPageQuestions(surveyId:number, page:number, language?: string): Observable<any> {

		return this._surveyViewerEndpointService.getSurveyViewerRespondentPageQuestionsEndpoint(surveyId,
			page,language);
	}

	/**
	 * Retrieves Terms and Conditions Text
	 * @param surveyId
	 * @param viewType
	 * @param language
	 */
	public getSurveyViewerTermsAndConditions(
		surveyId: number,
		viewType?: SurveyViewType,
		language?: string
	): Observable<SurveyViewTermsModel> {
		return this._surveyViewerEndpointService.getSurveyViewerTermsAndConditionsEndpoint(
			surveyId,
			viewType,
			language
		);
	}

	/**
	 * Start the specified survey with the provided shortcode. This will also have a login action.
	 * This will also set the active survey id
	 * @param surveyId
	 * @param shortcode
	 */
	public surveyStart(surveyId: number, shortcode: string): Observable<{}> {
		let result = this._surveyViewerEndpointService.getSurveyViewerStartSurveyEndpoint(
			surveyId,
			shortcode
		);

		result.subscribe((value: SurveyViewer) => {
			this._activeSurveyId = surveyId;
		}, error => {});
		return result;
	}

	/**
	 * Authenticates the current user using the specified shortcode
	 * @param surveyId
	 * @param shortcode
	 */
	public surveyLogin(surveyId: number, shortcode: string): Observable<User>
	{
		return this.authService
		.login(`${surveyId}_${shortcode}`, shortcode, true);
	}

	/**
	 * Returns the question configuration for specified question.
	 * @param questionId
	 */
	public getQuestionData(questionId: number): Observable<{}> {
		return this._surveyViewerEndpointService.getSurveyViewQuestionConfigurationEndpoint(
			questionId
		);
	}

	/**
	 *
	 * @param questionId
	 * @param query
	 */
	public getQuestionOptions(questionId: number, query: string = null)
	{
		return this._surveyViewerEndpointService.getQuestionOptionsEndpoint(questionId, query);
	}

	/**
	 * Restores the state of the service if the user is currently logged in.
	 */
	private restoreStatus(): void
	{
		if (this.authService.isLoggedIn && this.authService.currentUser.roles.includes('respondent'))
		{
			this._activeSurveyId = +this.authService.currentSurveyUser.surveyId;

			console.log(this._activeSurveyId);
		}
	}
}
