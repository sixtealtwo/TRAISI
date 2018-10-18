import { SurveyViewQuestion } from './survey-question.model';

export interface SurveyViewSection {

	id: number;

	questions: Array<SurveyViewQuestion>;

	order: number;

	label: string;

	isHousehold: boolean;

	isRepeat: boolean;


}
