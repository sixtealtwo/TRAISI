import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SurveyQuestionContainer } from './survey-question-container';

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
		// if true, then the survey can navigate to the next container

		this.evaluateRepeat().subscribe(() => {
			// look at the active view container and call navigate next on it
			let result: boolean = this._state.viewerState.activeViewContainer.navigateNext();

			if (result) {
				this.incrementViewContainer();
			}

			this.updateState();
			this.navigationCompleted.next(result);
		});
	}

	/**
	 * Updates state
	 */
	private updateState(): void {
		this._state.viewerState.activeQuestionContainer = this._state.viewerState.viewContainers[
			this._state.viewerState.activeViewContainerIndex
		].activeViewContainer;

		this._state.viewerState.activePage = (<SurveyQuestionContainer>(
			this._state.viewerState.activeQuestionContainer
		)).questionModel.parentPage;

		this._state.viewerState.activeQuestion = (<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel;
		this._state.viewerState.isSectionActive =
			(<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel.parentSection !== undefined;

		if ((<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel.parentSection !== undefined) {
			this._state.viewerState.activeSection = (<SurveyQuestionContainer>(
				this._state.viewerState.activeQuestionContainer
			)).questionModel.parentSection;
		} else {
			this._state.viewerState.activeSection = undefined;
		}

		console.log(this._state.viewerState.activeQuestionContainer);
	}

	/**
	 * Evaluates repeat
	 * @returns repeat
	 */
	private evaluateRepeat(): Subject<void> {
		let repeat$ = new Subject<void>();

		this._state
			.evaluateRepeat(
				(<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel,
				this._state.viewerState.activeRespondent.id
			)
			.subscribe((result) => {
				repeat$.next();
				repeat$.complete();
			});
		return repeat$;
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
		let result: boolean = this._state.viewerState.activeViewContainer.navigatePrevious();

		// if true, then the survey can navigate to the next container
		if (result) {
			this.decrementViewContainer();
		}

		this.updateState();
		this.navigationCompleted.next(result);
	}

	/**
	 * Initializes survey viewer navigation service
	 */
	public initialize(): void {
		this._state.viewerState.activeViewContainerIndex = -1;
		this.incrementViewContainer();
		this.updateState();
	}

	public updateNavigationState(): void {
		// check bounds
	}
}
