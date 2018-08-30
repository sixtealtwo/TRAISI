import {QuestionOption} from './question-option';

export interface OnVisibilityChanged
{
	onQuestionShown(): void;

	onQuestionHidden(): void;
}

export interface OnOptionsLoaded {

	onOptionsLoaded(options: QuestionOption[]): void;

}

