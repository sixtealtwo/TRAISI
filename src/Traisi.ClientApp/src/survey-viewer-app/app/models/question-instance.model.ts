import { SurveyViewQuestion } from './survey-view-question.model';
import { QuestionContainerComponent } from 'app/components/question-container/question-container.component';
import { ResponseValidationState } from 'traisi-question-sdk';
import { Observable } from 'rxjs';
import { ValidationState } from 'app/services/survey-viewer-api-client.service';
import { QuestionInstanceState } from 'app/services/question-instance.service';
import { SurveyViewerValidationStateViewModel } from './survey-viewer-validation-state.model';

/**
 * Represents a question isntance that is displayable.
 * @export
 * @interface QuestionInstance
 */
export interface QuestionInstance {
	id: string;

	index: number;

	model: SurveyViewQuestion;

	validationState: SurveyViewerValidationStateViewModel;

	component: any;

	questionInstanceState: QuestionInstanceState;
}
