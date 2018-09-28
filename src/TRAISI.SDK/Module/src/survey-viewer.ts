import { Subject } from 'rxjs';
import { QuestionConfiguration } from './question-configuration';
import { QuestionOption } from './question-option';
export interface SurveyViewer {
	configurationData: Subject<QuestionConfiguration[]>;
	options: Subject<QuestionOption[]>;
	accessToken: string;
	updateNavigationState(canNavigate: boolean): void;
}
