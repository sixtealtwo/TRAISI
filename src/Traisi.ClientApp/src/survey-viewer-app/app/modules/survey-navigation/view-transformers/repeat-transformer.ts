import { NavigationState } from 'app/models/navigation-state.model';
import { SurveyResponseService, TraisiValues, SurveyViewQuestion, SurveyRespondent } from 'traisi-question-sdk';
import { Injectable, Inject } from '@angular/core';
import { ViewTransformation } from './view-transformation';
import { ViewTransformer } from '../services/survey-navigator/view-transformer.service';
import { SurveyViewerResponseService } from 'app/services/survey-viewer-response.service';
import { QuestionInstance } from 'app/models/question-instance.model';
import { ValidationState } from 'app/services/survey-viewer-api-client.service';
@Injectable({
	providedIn: 'root',
})
export class RepeatTransformer extends ViewTransformation {
	public constructor(
		@Inject(TraisiValues.SurveyResponseService) private _responseService: SurveyViewerResponseService
	) {
		super();
	}
	/**
	 * Transforms the current navigation state by removing (hiding) questions that are not visible
	 * as the result of conditional logic evaluation.
	 * @param state
	 */
	public transformNavigationState(state: NavigationState, questionInstances: QuestionInstance[]): QuestionInstance[] {
		// loop through the active question instances and duplicate them
		console.log('in transform');
		let clones = [];
		for (let question of questionInstances) {
			let clone: QuestionInstance = {
				component: undefined,
				id: this.getQuestionInstanceId(question.model, 1, state.activeRespondent),
				model: question.model,
				questionInstanceState: null,
				repeat: 1,
				validationState: {
					isValid: false,
					questionValidationState: {
						validationState: ValidationState.Untouched,
						errorMessages: [],
					},
					surveyLogicValidationState: {
						validationState: ValidationState.Untouched,
						errorMessages: [],
					},
				},
				index: state.activeQuestionIndex,
			};
			console.log('added clone');
			clones.push(clone);
		}
		console.log(clones);
		console.log(questionInstances.concat(clones));
		return questionInstances.concat(clones);
	}

	private getQuestionInstanceId(
		question: SurveyViewQuestion,
		repeat: number = 0,
		respondent: SurveyRespondent
	): string {
		return `${question.id}_${respondent.id}_${repeat}`;
	}
}
