import { Observable } from "rxjs";
import { SurveyViewerStateService } from './survey-viewer-state.service';


export class SurveyViewerNavigation {

	public constructor(private _state: SurveyViewerStateService) {

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
