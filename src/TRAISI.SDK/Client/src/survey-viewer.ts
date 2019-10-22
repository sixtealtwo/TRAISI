import { Subject, Observable } from 'rxjs';
import { QuestionConfiguration } from './question-configuration';
import { QuestionOption } from './question-option';
import { SurveyRespondent } from './survey-respondent';
export interface SurveyViewer {
	configurationData: Subject<QuestionConfiguration[]>;
	options: Subject<QuestionOption[]>;
	accessToken: string;
	updateNavigationState(canNavigate: boolean): void;
	preparePreviousSurveyResponses(respondent: SurveyRespondent, currentQuestionId: number): Observable<any>;
}
