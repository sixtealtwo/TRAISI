import { Injectable } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/of';
import { SurveyViewer } from '../models/survey-viewer.model';
import { SurveyStart } from '../models/survey-start.model';
import { SurveyViewType } from '../models/survey-view-type.enum';
import { SurveyViewTermsModel } from '../models/survey-view-terms.model';
import { AuthService } from 'app/services/auth.service';
import { User } from 'app/models/user.model';
import { ISurveyViewerService, IQuestionConfiguration } from 'traisi-question-sdk';
@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService implements ISurveyViewerService {


	configurationData: Subject<IQuestionConfiguration[]>;

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
	 */
	constructor(private _surveyViewerEndpointService: SurveyViewerEndpointService,
		private authService: AuthService) {
		this._activeSurveyId = -1;
		this.restoreStatus();
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
