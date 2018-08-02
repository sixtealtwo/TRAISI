import { Injectable } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';
import { Observable, of, Operator, Subscriber, Observer } from 'rxjs';
import 'rxjs/add/observable/of';
import { SurveyViewer } from '../models/survey-viewer.model';
import { SurveyStart } from '../models/survey-start.model';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService {
	constructor(private _surveyViewerEndpointService: SurveyViewerEndpointService) {}

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
	 * Start the specified survey with the provided shortcode. This will also have a login action.
	 * @param surveyId
	 * @param shortcode
	 */
	public surveyStart(surveyId: number, shortcode: string): Observable<SurveyViewer> {
		return this._surveyViewerEndpointService.getSurveyViewerStartSurveyEndpoint(
			surveyId,
			shortcode
		);
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
}
