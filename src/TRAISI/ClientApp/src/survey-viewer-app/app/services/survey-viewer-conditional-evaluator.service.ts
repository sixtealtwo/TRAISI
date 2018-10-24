import { Injectable } from '@angular/core';
import { SurveyViewerStateService } from './survey-viewer-state.service';
import { SurveyResponderService } from './survey-responder.service';

@Injectable()
export class SurveyViewerConditionalEvaluator {
	/**
	 *
	 * @param _state q
	 * @param _responderService
	 */
	constructor(private _state: SurveyViewerStateService, private _responderService: SurveyResponderService) {}

	/**
	 * Evalutes all known conditions for the passsed question  id.
	 *
	 * This method will return true if one of the conditionals returned true - otherwise false;
	 * @param questionId
	 */
	public evaluateConditionals(questionId: number): boolean {
		return false;
	}
}
