import { Observable, ReplaySubject } from 'rxjs';
import { SurveyViewerStateService } from './survey-viewer-state.service';
import { SurveyViewQuestion } from '../models/survey-view-question.model';


export class SurveyViewerNavigation {

	private currentQuestion: ReplaySubject<SurveyViewQuestion>;


	/**
	 *
	 */
	public constructor(private _state: SurveyViewerStateService) {
		this.currentQuestion = new ReplaySubject<SurveyViewQuestion>(1);
	}

	public navigateNext(): Observable<void> {

		return Observable.of();
	}

	public navigatePrevious(): Observable<void> {
		return Observable.of();
	}

	public navigateToQuestion(): Observable<void> {

		return Observable.of();
	}

	public navigateToPage(): Observable<void> {

		return Observable.of();
	}

}
