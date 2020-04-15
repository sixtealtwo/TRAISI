import { SurveyViewQuestion } from './survey-view-question.model';
import { QuestionContainerComponent } from 'app/components/question-container/question-container.component';
import { ResponseValidationState } from 'traisi-question-sdk';
import { Observable } from 'rxjs';
/**
 * Represents a question isntance that is displayable.
 * @export
 * @interface QuestionInstance
 */
export interface QuestionInstance {
	id: number;

	index: number;

	model: SurveyViewQuestion;

	validationState: ResponseValidationState;

	component: any;
}
