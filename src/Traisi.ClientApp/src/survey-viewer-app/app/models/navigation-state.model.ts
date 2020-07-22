import { QuestionInstance } from './question-instance.model';
import { SurveyViewPage } from './survey-view-page.model';
import { SurveyViewSection } from './survey-view-section.model';
import { SurveyViewGroupMember } from './survey-view-group-member.model';
import { SurveyViewerValidationStateViewModel } from './survey-viewer-validation-state.model';


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
	activeValidationStates: { [id: number]: SurveyViewerValidationStateViewModel };
	isMultiView?: boolean;
	isLoaded: boolean;
	isNextEnabled: boolean;
	isPreviousEnabled: boolean;
}
