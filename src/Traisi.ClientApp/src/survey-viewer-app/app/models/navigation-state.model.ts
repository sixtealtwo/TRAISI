import { QuestionInstance } from "./question-instance.model";
import { SurveyViewPage } from "./survey-view-page.model";
import { SurveyViewSection } from "./survey-view-section.model";
import { SurveyViewGroupMember } from './survey-view-group-member.model';

export interface NavigationState {
	activePage?: SurveyViewPage;
	activePageIndex?: number;
	activeSectionId?: number;
	activeSection?: SurveyViewSection;
	activeSectionIndex?: number;
	activeQuestionInstances: Array<QuestionInstance>;
	activeQuestionIndex: number;
	activeRespondent?: SurveyViewGroupMember;
	activeRespondentIndex?: number;
	isMultiView?: boolean;
	isLoaded: boolean;
	isNextEnabled: boolean;
	isPreviousEnabled: boolean;
}
