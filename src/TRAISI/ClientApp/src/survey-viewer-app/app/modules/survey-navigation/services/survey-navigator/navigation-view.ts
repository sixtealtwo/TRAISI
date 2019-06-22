import { SurveyViewQuestion } from 'app/models/survey-view-question.model';

export abstract class NavigationView {

	public abstract listActiveQuestions(): Array<SurveyViewQuestion>;

	public abstract incrementNavigation(): boolean;

	public abstract decrementNavigation(): boolean;

}
