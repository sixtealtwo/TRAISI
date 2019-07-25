import { SurveyViewQuestion } from './survey-view-question.model';
import { QuestionContainerComponent } from 'app/components/question-container/question-container.component';
import { ResponseValidationState } from 'traisi-question-sdk';

export interface QuestionInstance {
	id: string;

	index: number;

	model: SurveyViewQuestion;

	validationState: ResponseValidationState;

}
