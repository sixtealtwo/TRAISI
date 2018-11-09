import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { Subject } from 'rxjs';
export abstract class SurveyContainer {
	public abstract containerId: number;

	public abstract navigatePrevious(): boolean;
	public abstract navigateNext(): boolean;
	public abstract initialize(): Subject<void>;
}
