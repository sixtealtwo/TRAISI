import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { SurveyQuestionContainer } from './survey-question-container';
import { SurveySectionContainer } from './survey-section-container';
import { SurveyResponderService } from '../survey-responder.service';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { flatMap } from 'rxjs/operators';

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
	 * Creates an instance of survey viewer navigation service.
	 * @param _state
	 * @param _surveyResponderService
	 */
	public constructor(
		private _state: SurveyViewerStateService,
		@Inject('SurveyResponderService') private _responderService: SurveyResponderService,
		private router: Router,
		private location: Location
	) {
		this.navigationCompleted = new Subject<boolean>();
	}

	/**
	 * Navigates to the viewer state to the next question
	 */
	public navigateNext(): void {
		// if true, then the survey can navigate to the next container

		if (this._state.viewerState.activeViewContainer === undefined) {
			// sane bounds check
			this.navigationCompleted.next(true);
			return;
		} else {
			this.evaluateRepeat()
				.pipe(
					flatMap(() => {
						return this.evaluateConditionals();
					})
				)
				.subscribe(() => {
					// look at the active view container and call navigate next on it

					let result: boolean;
					do {
						result = this._state.viewerState.activeViewContainer.navigateNext();

						if (result) {
							this.incrementViewContainer();
						}
					} while (this._state.viewerState.activeViewContainer.iterateNext());

					this._state.viewerState.isPreviousEnabled = true;

					let nextContainer = this._state.viewerState.viewContainers[
						this._state.viewerState.activeViewContainerIndex
					].activeViewContainer;
					let currentParentContainer = (<SurveyQuestionContainer>(
						this._state.viewerState.activeQuestionContainer
					)).parentSectionContainer;
					let nextParentContainer = (<SurveyQuestionContainer>nextContainer).parentSectionContainer;
					let isHousehold = nextParentContainer ? nextParentContainer.isHousehold : null;

					if (isHousehold && currentParentContainer !== nextParentContainer) {
						this._responderService
							.getSurveyGroupMembers()
							.subscribe((members: Array<SurveyViewGroupMember>) => {
								if (members.length > 0) {
									this._state.viewerState.groupMembers = [];
									members.forEach(member => {
										this._state.viewerState.groupMembers.push(member);
									});

									nextParentContainer.updateGroups();
									this.updateState();
									this.navigationCompleted.next(result);
								}
							});
					} else {
						this.updateState();
						this.navigationCompleted.next(result);
					}
				});
		}
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

		this._state.viewerState.activeQuestion = (<SurveyQuestionContainer>(
			this._state.viewerState.activeQuestionContainer
		)).questionModel;
		this._state.viewerState.isSectionActive =
			(<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel.parentSection !==
			undefined;

		if (
			(<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel.parentSection !==
			undefined
		) {
			this._state.viewerState.activeSection = (<SurveyQuestionContainer>(
				this._state.viewerState.activeQuestionContainer
			)).questionModel.parentSection;
		} else {
			this._state.viewerState.activeSection = undefined;
		}

		this._state.viewerState.activePageIndex = (<SurveyQuestionContainer>(
			this._state.viewerState.activeQuestionContainer
		)).questionModel.pageIndex;

		const baseUrl = this.router.url.split('?')[0];
		const url = this.router
			.createUrlTree([baseUrl], { queryParams: { question: this._state.viewerState.activeQuestion.id } })
			.toString();

		if (!this.canNavigatePrevious()) {
			this._state.viewerState.isPreviousEnabled = false;
		} else {
			this._state.viewerState.isPreviousEnabled = true;
		}

		if (!this.canNavigateNext()) {
			this._state.viewerState.isNavComplete = true;
			this._state.viewerState.isNextEnabled = false;
		} else {
			this._state.viewerState.isNavComplete = false;
			this._state.viewerState.isNextEnabled = true;
		}

		// this.location.go(url);
	}

	private canNavigatePrevious(): boolean {
		if (!this._state.viewerState.activeViewContainer.canNavigatePrevious()) {
			if (this._state.viewerState.activeViewContainerIndex <= 0) {
				return false;
			}
		}
		return true;
	}

	private canNavigateNext(): boolean {
		if (!this._state.viewerState.activeViewContainer.canNavigateNext()) {
			if (this._state.viewerState.activeViewContainerIndex >= this._state.viewerState.viewContainers.length - 1) {
				return false;
			}
		}
		return true;
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
			.subscribe(result => {
				repeat$.next();
				repeat$.complete();
			});
		return repeat$;
	}

	private evaluateConditionals(): Subject<void> {
		let conditionals$ = new Subject<void>();

		this._state
			.evaluateConditionals(
				(<SurveyQuestionContainer>this._state.viewerState.activeQuestionContainer).questionModel.questionId,
				this._state.viewerState.activeRespondent.id
			)
			.subscribe(result => {
				conditionals$.next();
				conditionals$.complete();
			});
		return conditionals$;
	}

	/**
	 * Increments view container
	 */
	private incrementViewContainer(): void {
		this._state.viewerState.activeViewContainerIndex++;

		this._state.viewerState.activeViewContainer = this._state.viewerState.viewContainers[
			this._state.viewerState.activeViewContainerIndex
		];

		if ((<SurveySectionContainer>this._state.viewerState.activeViewContainer).isHousehold) {
			this._responderService.getSurveyGroupMembers().subscribe((members: Array<SurveyViewGroupMember>) => {
				if (members.length > 0) {
					this._state.viewerState.groupMembers = [];
					members.forEach(member => {
						this._state.viewerState.groupMembers.push(member);
					});
				}
				this._state.viewerState.activeViewContainer.initialize();
			});
		} else {
			this._state.viewerState.activeViewContainer.initialize();
		}
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
		if (this._state.viewerState.activeViewContainer === null) {
			this.updateState();
			this.navigationCompleted.next(true);
		} else {
			this.evaluateRepeat().subscribe(() => {
				// look at the active view container and call navigate next on it

				let result;
				do {
					result = this._state.viewerState.activeViewContainer.navigatePrevious();

					if (result) {
						this.decrementViewContainer();
					}
				} while (this._state.viewerState.activeViewContainer.iteratePrevious());

				if (result) {
					if (this._state.viewerState.activeViewContainerIndex > 0) {
						this.decrementViewContainer();
					}
				}

				this.updateState();
				this.navigationCompleted.next(result);
			});
		}
	}

	/**
	 * Initializes survey viewer navigation service
	 */
	public initialize(): void {
		this._state.viewerState.isPreviousEnabled = false;
		this._state.viewerState.activeViewContainerIndex = -1;
		this.incrementViewContainer();
		this.updateState();
	}

	public updateNavigationState(): void {
		// check bounds
	}
}
