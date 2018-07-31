import { Injectable } from '@angular/core';
import { SurveyViewerEndpointService } from './survey-viewer-endpoint.service';
import { Observable, of, Operator, Subscriber, Observer } from 'rxjs';
import 'rxjs/add/observable/of';
import { SurveyViewer } from '../models/survey-viewer.model';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerService {
	constructor(
		private _surveyViewerEndpointService: SurveyViewerEndpointService
	) {}

	/**
	 *
	 * @param surveyId
	 * @param language
	 */
	public getDefaultSurveyView(surveyId: number, language?: string): Observable<SurveyViewer>
	{
		return this._surveyViewerEndpointService.getDefaultSurveyViewEndpoint(surveyId, language);
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
