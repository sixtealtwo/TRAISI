import { QuestionOption } from './question-option';
import { QuestionConfiguration } from './question-configuration';

//import {EventEmitter} from '@angular/core';

export interface OnVisibilityChanged {
	/**
	 *
	 */
	onQuestionShown(): void;

	/**
	 *
	 */
	onQuestionHidden(): void;
}

export interface OnOptionsLoaded {
	/**
	 *
	 * @param options
	 */
	onOptionsLoaded(options: QuestionOption[]): void;
}

export interface OnSurveyQuestionInit {
	/**
	 *
	 * @param configuration
	 */
	onSurveyQuestionInit(configuration: QuestionConfiguration[]): void;

	/**
	 *
	 */
	response: any;
}
