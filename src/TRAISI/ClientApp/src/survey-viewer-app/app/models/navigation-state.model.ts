import { QuestionInstance } from "./question-instance.model";
import { SurveyViewPage } from "./survey-view-page.model";

export interface NavigationState {

	activePage?: SurveyViewPage;
	activePageIndex?: number;
	activeSectionId?: number;
	activeSectionIndex?: number;
	activeQuestionInstances: Array<QuestionInstance>;
	activeQuestionIndex: number;
	isMultiView?: boolean;
	isLoaded: boolean;
	isNextEnabled: boolean;
	isPreviousEnabled: boolean;

}
