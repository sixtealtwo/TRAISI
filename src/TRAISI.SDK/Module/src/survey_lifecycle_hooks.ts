import { QuestionOption } from './question-option';
import { QuestionConfiguration } from './question-configuration';



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
	 */
	response: any;

	/**
	 *
	 * @param configuration
	 */
	onSurveyQuestionInit(configuration: QuestionConfiguration[]): void;
}

export interface OnSaveResponseStatus {
	/**
	 *
	 *
	 * @param {*} result
	 * @memberof OnSaveResponseStatus
	 */
	onResponseSaved(result: any): void;
}
