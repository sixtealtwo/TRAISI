import { NavigationView } from './navigation-view';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';

export class SectionNavigationView extends NavigationView {
	public listActiveQuestions(): SurveyViewQuestion[] {
		throw new Error('Method not implemented.');
	}	public incrementNavigation(): boolean {
		throw new Error('Method not implemented.');
	}
	public decrementNavigation(): boolean {
		throw new Error('Method not implemented.');
	}


}
