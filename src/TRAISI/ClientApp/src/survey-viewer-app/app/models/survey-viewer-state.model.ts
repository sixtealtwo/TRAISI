import { SurveyViewQuestion } from './survey-view-question.model';
import { SurveyViewPage } from './survey-view-page.model';
import { SurveyViewSection } from './survey-view-section.model';
import { SurveyViewGroupMember } from './survey-view-group-member.model';
import { ResponseValidationState } from 'traisi-question-sdk';

export interface SurveyViewerState {
	surveyPages: Array<SurveyViewPage>;
	surveyQuestions: Array<SurveyViewQuestion>;
	surveyQuestionsFull: Array<SurveyViewQuestion>;
	activeQuestion: SurveyViewQuestion;
	activeSection: SurveyViewSection;
	activePage: SurveyViewPage;
	isSectionActive: boolean;
	activeQuestionIndex: number;
	activePageIndex: number;
	activeRepeatIndex: number;
	groupMembers: Array<SurveyViewGroupMember>;
	activeGroupMemberIndex: number;
	primaryRespondent: SurveyViewGroupMember;
	activeGroupQuestions: Array<SurveyViewQuestion>;
	isLoaded: boolean;
	questionMap: { [id: number]: SurveyViewQuestion };
}
