import { SurveyViewQuestion } from './survey-question.model';
import { SurveyViewSection } from './survey-view-section.model';

export interface SurveyViewPage {

	id: number;

	sections: Array<SurveyViewSection>;

	questions: Array<SurveyViewQuestion>;

	order: number;

	label: string;

	icon: string;

}
