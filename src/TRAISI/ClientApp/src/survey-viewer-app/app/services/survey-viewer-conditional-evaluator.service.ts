import { Injectable, Inject } from '@angular/core';
import { SurveyViewerStateService } from './survey-viewer-state.service';
import { SurveyResponderService } from './survey-responder.service';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerConditionalEvaluator {
	/**
	 *
	 * @param _state q
	 * @param _responderService
	 */
	constructor() {}

	/**
	 *
	 * @param conditionalType
	 * @param sourceData
	 * @param targetData
	 * @param value
	 */
	public evaluateConditional(conditionalType: string, sourceData: any, targetData: any, value: any): boolean {
		switch (conditionalType) {
			case 'contains':
				return this.evaluateContains(sourceData, value);
			case 'doesNotContain':
				return !this.evaluateContains(sourceData, value);
			default:
				return false;
		}
	}

	/**
	 *
	 * @param sourceData
	 * @param value
	 */
	private evaluateContains(sourceData: any, value: string): boolean {
		const val: boolean = sourceData.value.indexOf(value) >= 0;

		return val;
	}
}
