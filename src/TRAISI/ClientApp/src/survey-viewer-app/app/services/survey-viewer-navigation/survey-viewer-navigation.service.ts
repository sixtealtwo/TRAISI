import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerNavigationService {

	public navigationCompleted: Subject<boolean>;

	public isNavigationNextEnabled: boolean = true;

	public isNavigationPreviousEnabled: boolean = true;

	public get activeQuestion(): SurveyViewQuestion {
		return null;
	}

	/**
	 *
	 * @param _viewerState
	 */
	public constructor(private _state: SurveyViewerStateService) {
		this.navigationCompleted = new Subject<boolean>();
	}

	/**
	 * Navigates to the viewer state to the next question
	 */
	public navigateNext(): void {
		// look at the active view container and call navigate next on it
		let result: boolean = this._state.viewerState.activeViewContainer.navigateNext();

		// if true, then the survey can navigate to the next container
		if (result) {
			this.incrementViewContainer();
		}

		this._state.viewerState.activePage = this._state.viewerState.activeViewContainer.activeQuestion.parentPage;
		this._state.viewerState.activePageIndex = this._state.viewerState.activeViewContainer.activeQuestion.pageIndex;
		this.navigationCompleted.next(result);
	}

	/**
	 * Increments view container
	 */
	private incrementViewContainer(): void {
		this._state.viewerState.activeViewContainerIndex++;

		this._state.viewerState.activeViewContainer = this._state.viewerState.viewContainers[
			this._state.viewerState.activeViewContainerIndex
		];
		this._state.viewerState.activeViewContainer.initialize();
	}

	private decrementViewContainer(): void {
		this._state.viewerState.activeViewContainerIndex--;

		this._state.viewerState.activeViewContainer = this._state.viewerState.viewContainers[
			this._state.viewerState.activeViewContainerIndex
		];
		this._state.viewerState.activeViewContainer.initialize();
	}

	/**
	 * Navigates the viewer state to the previous question
	 */
	public navigatePrevious(): void {
		// look at the active view container and call navigate next on it
		let result: boolean = this._state.viewerState.activeViewContainer.navigateNext();

		// if true, then the survey can navigate to the next container
		if (result) {
			this.decrementViewContainer();
		}

		this.navigationCompleted.next(result);
	}

	/**
	 * Initializes survey viewer navigation service
	 */
	public initialize(): void {
		this._state.viewerState.activeViewContainerIndex = -1;
		this.incrementViewContainer();
	}

	public updateNavigationState(): void {

		// check bounds


	}
}
