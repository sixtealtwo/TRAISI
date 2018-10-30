import { SurveyViewerStateService } from './survey-viewer-state.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerNavigationService {
	/**
	 *
	 * @param _viewerState
	 */
	public constructor(private _viewerState: SurveyViewerStateService) {}

	/**
	 * Navigates to the viewer state to the next question
	 */
	public navigateNext(): Subject<void> {
		const subject: Subject<void> = new Subject<void>();
		return subject;
	}

	/**
	 * Navigates the viewer state to the previous question
	 */
	public navigatePrevious(): Subject<void> {
		const subject: Subject<void> = new Subject<void>();
		return subject;
	}
}
