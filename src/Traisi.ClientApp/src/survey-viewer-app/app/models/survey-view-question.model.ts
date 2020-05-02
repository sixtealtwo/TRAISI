import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { SurveyViewPage } from './survey-view-page.model';
import { SurveyViewGroupMember } from './survey-view-group-member.model';
import { SurveyViewConditional } from './survey-view-conditional.model';
import { ResponseValidationState } from 'traisi-question-sdk';
import { QuestionConditionalOperator } from './question-conditional-operator.model';
export interface SurveyViewQuestion {
	configuration: object | Array<any> | any;
	id: number;
	isHidden?: boolean;
	isRespondentHidden?: { [id: number]: boolean };
	respondentValidationState?: { [id: number]: ResponseValidationState };
	isOptional: boolean;
	isRepeat: boolean;
	label: string;
	name: string;
	order: number;
	viewOrder: number;
	questionId: number;
	questionType: string;
	pageIndex: number;
	repeatSource?: number;
	repeatTargets?: number[];
	repeatChildren?: { [id: string]: Array<SurveyViewQuestion> };
	navigationOder: number;
	repeatNumber?: number;
	inSectionIndex?: number;

	// convenient ref to section or page

	parentSection: SurveyViewSection;
	parentPage: SurveyViewPage;
	viewId: Symbol;
	parentMember?: SurveyViewGroupMember;
	validationState: ResponseValidationState;
	conditionals: Array<QuestionConditionalOperator>;
}
