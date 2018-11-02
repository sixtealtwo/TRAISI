import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { SurveyViewPage } from './survey-view-page.model';
import { ResponseValidationState } from '../../../../../../TRAISI.SDK/Module/src/question-response-state';
import { SurveyViewGroupMember } from './survey-view-group-member.model';
import { SurveyViewConditional } from './survey-view-conditional.model';
export interface SurveyViewQuestion {
	configuration: object | Array<any> | any;
	id: number;
	isOptional: boolean;
	isRepeat: boolean;
	label: string;
	order: number;
	viewOrder: number;
	questionId: number;
	questionType: string;
	pageIndex: number;
	typeName: string;
	repeatSource?: number;
	repeatTargets?: number[];
	repeatChildren?: { [id: string]: Array<SurveyViewQuestion> };
	repeatNumber?: number;
	inSectionIndex?: number;

	// convenient ref to section or page

	parentSection: SurveyViewSection;
	parentPage: SurveyViewPage;
	viewId: Symbol;
	parentMember?: SurveyViewGroupMember;
	validationState: ResponseValidationState;
	sourceConditionals?: Array<SurveyViewConditional>;
	targetConditionals?: Array<SurveyViewConditional>;
}
