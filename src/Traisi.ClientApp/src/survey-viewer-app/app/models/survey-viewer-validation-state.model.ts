import { ResponseValidationState } from 'traisi-question-sdk';
import { ValidationStateViewModel } from './validation-state-view.model';

export interface SurveyViewerValidationStateViewModel {
	isValid: boolean;
	clientValidationState: ResponseValidationState;
	questionValidationState: ValidationStateViewModel | undefined;
	surveyLogicValidationState: ValidationStateViewModel | undefined;
}
