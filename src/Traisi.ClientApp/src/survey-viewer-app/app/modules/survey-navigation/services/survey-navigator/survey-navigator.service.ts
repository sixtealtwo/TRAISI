import { Injectable, Inject } from '@angular/core';
import { SurveyViewerStateService } from '../../../../services/survey-viewer-state.service';
import { Subject, Observable, Observer, BehaviorSubject, EMPTY, forkJoin } from 'rxjs';
import { NavigationState } from '../../../../models/navigation-state.model';
import { QuestionInstance } from 'app/models/question-instance.model';
import { SurveyViewPage } from 'app/models/survey-view-page.model';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { findIndex, every } from 'lodash';
import { expand, share, tap, flatMap, map, count, takeWhile } from 'rxjs/operators';
import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { ConditionalEvaluator } from 'app/services/conditional-evaluator/conditional-evaluator.service';
import { QuestionInstanceState } from 'app/services/question-instance.service';
import { ValidationState, SurveyViewerValidationStateViewModel } from 'app/services/survey-viewer-api-client.service';
import { SurveyViewerRespondentService } from 'app/services/survey-viewer-respondent.service';

/**
 *
 *
 * @export
 * @class SurveyNavigator
 */
@Injectable({
	providedIn: 'root',
})
export class SurveyNavigator {
	/**
	 * Navigation state changed event emitter.
	 */
	public navigationStateChanged: Subject<NavigationState>;

	/**
	 * The current navigation state.
	 */
	public navigationState$: BehaviorSubject<NavigationState>;

	/**
	 * @type {BehaviorSubject<boolean>}
	 */
	public previousEnabled$: BehaviorSubject<boolean>;

	public nextEnabled$: BehaviorSubject<boolean>;

	public logicState$: Subject<any>;

	private _surveyCompleted$: Subject<void>;

	private _previousState: NavigationState;

	/**
	 * Listen for the end of the survey
	 */
	public get surveyCompleted$(): Observable<void> {
		return this._surveyCompleted$;
	}

	/**
	 *Creates an instance of SurveyNavigator.
	 * @param {SurveyViewerStateService} _surveyState
	 * @memberof SurveyNavigator
	 */
	public constructor(
		private _state: SurveyViewerStateService,
		private _conditionalEvaluator: ConditionalEvaluator,
		@Inject('SurveyRespondentService')
		private _respondentService: SurveyViewerRespondentService
	) {
		this.navigationStateChanged = new Subject<NavigationState>();
		let initialState: NavigationState = {
			activeQuestionInstances: [],
			isLoaded: false,
			activeQuestionIndex: 0,
			isNextEnabled: true,
			isPreviousEnabled: true,
			activeValidationStates: [],
		};
		this.navigationState$ = new BehaviorSubject<NavigationState>(initialState);
		this.previousEnabled$ = new BehaviorSubject<boolean>(false);
		this.nextEnabled$ = new BehaviorSubject<boolean>(false);
		this.navigationStateChanged.next(initialState);
		this._surveyCompleted$ = new Subject<void>();
	}

	/** */
	public initialize(): void {
		this.navigateToPage(this._state.viewerState.surveyPages[0].id).subscribe();
		this.nextEnabled$.next(true);
		// this.validationChanged();
	}

	/**
	 *
	 * @param part
	 */
	public _getBaseQuestionModels(part: SurveyViewPage | SurveyViewSection): SurveyViewQuestion[] {
		let questions = [];
		questions = questions.concat(part.questions);
		return questions;
	}

	/**
	 * Navigate to the next viewable portion of the survey
	 */
	public navigateNext(): Observable<NavigationState> {
		this._previousState = this.navigationState$.value;
		let nav = this._incrementNavigation(this.navigationState$.value).pipe(share());
		this.nextEnabled$.next(false);
		nav.subscribe((state) => {
			this.previousEnabled$.next(true);
			this.navigationState$.next(state);
			this._checkValidation();
		});
		return nav;
	}

	/**
	 * Navigate to the previous question or section.
	 */
	public navigatePrevious(): Observable<NavigationState> {
		this._previousState = this.navigationState$.value;
		let prev = this._decrementNavigation(this.navigationState$.value).pipe(share());
		prev.subscribe((state) => {
			/*if (state.activeQuestionInstances.length > 0) {
				if (this._isMultiViewActive(state)) {
					state.activeQuestionIndex -=
						this._state.viewerState.surveyQuestions[state.activeQuestionIndex].parentSection.questions
							.length - 1;
				}
			}*/
			this.navigationState$.next(state);
			if (state.activeQuestionIndex === 0) {
				this.previousEnabled$.next(false);
			}
			this._checkValidation();
		});
		return prev;
	}

	/**
	 *
	 * @param questionId
	 */
	public navigateToQuestion(questionId: number): Observable<NavigationState> {
		return new Observable((obs: Observer<NavigationState>) => {
			obs.complete();
		});
	}

	/**
	 *
	 * @param page
	 * @param section
	 */
	public navigateToSection(page: SurveyViewPage, section: SurveyViewSection): Observable<NavigationState> {
		let blockIndex: number = findIndex(this._state.viewerState.questionBlocks, (block: SurveyViewQuestion[]) => {
			return block[0].parentSection?.id === section.id;
		});
		if (blockIndex < 0) {
			blockIndex = 0;
		}
		let pageIndex = findIndex(this._state.viewerState.questionBlocks, (block: SurveyViewQuestion[]) => {
			return this._state.viewerState.surveyPages[block[0]?.pageIndex]?.id === page.id;
		});
		return new Observable((obs: Observer<NavigationState>) => {
			let navigationState: NavigationState = {
				activePage: this._state.viewerState.surveyPages[pageIndex],
				activeSectionIndex: -1,
				activeSectionId: section.id,
				activeSection: section,
				activeQuestionIndex: blockIndex,
				activeRespondent: this._state.viewerState.primaryRespondent,
				activeRespondentIndex: 0,
				activeQuestionInstances: [],
				isLoaded: true,
				isNextEnabled: true,
				activeValidationStates: [],
				isPreviousEnabled: true,
			};

			this._initState(navigationState).subscribe((r) => {
				this.navigationState$.next(r);
				obs.next(r);
				obs.complete();
			});

			this._initQuestionInstancesForState(navigationState).subscribe((questionInstances) => {
				navigationState.activeQuestionInstances = questionInstances;
				this.validationChanged();
			});
		});
	}

	/**
	 *
	 * @param pageId
	 */
	public navigateToPage(pageId: number): Observable<NavigationState> {
		let pageIndex = findIndex(this._state.viewerState.surveyPages, (page) => {
			return page.id === pageId;
		});
		// find question index of page
		let page = this._state.viewerState.surveyPages[pageIndex];

		let blockIndex: number = findIndex(this._state.viewerState.questionBlocks, (block: SurveyViewQuestion[]) => {
			return this._state.viewerState.surveyPages[block[0]?.pageIndex]?.id === page.id;
		});

		if (blockIndex < 0) {
			blockIndex = 0;
		}

		return new Observable((obs: Observer<NavigationState>) => {
			let navigationState: NavigationState = {
				activePage: this._state.viewerState.surveyPages[pageIndex],
				activeSectionIndex: -1,
				activeSectionId: this._state.viewerState.questionBlocks[blockIndex][0]?.parentSection?.id,
				activeSection: this._state.viewerState.questionBlocks[blockIndex][0]?.parentSection,
				activeQuestionIndex: blockIndex,
				activeRespondent: this._state.viewerState.primaryRespondent,
				activeRespondentIndex: 0,
				activeQuestionInstances: [],
				isLoaded: true,
				isNextEnabled: true,
				activeValidationStates: [],
				isPreviousEnabled: true,
			};

			this._initState(navigationState).subscribe((r) => {
				this.navigationState$.next(r);
				obs.next(r);
				obs.complete();
			});

			this._initQuestionInstancesForState(navigationState).subscribe((questionInstances) => {
				navigationState.activeQuestionInstances = questionInstances;
				this.validationChanged();
			});
		});
	}

	/**
	 * Increments the current navigation state
	 * @param currentState
	 */
	private _incrementNavigation(currentState: NavigationState): Observable<NavigationState> {
		const newState: NavigationState = Object.assign({}, this.navigationState$.value);

		// get active question
		if (
			!newState.activeQuestionInstances[0]?.component?.navigateInternalNext() &&
			newState.activeQuestionInstances.length > 0
		) {
			// ignore
		} else if (
			newState.activeSection?.isHousehold &&
			newState.activeRespondentIndex < this._state.viewerState.groupMembers.length - 1
		) {
			newState.activeRespondentIndex++;
		} else {
			newState.activeQuestionIndex += 1;
			newState.activeRespondentIndex = 0;
		}

		if (this._isOutsideSurveyBounds(newState)) {
			this._surveyCompleted$.complete();
			return EMPTY;
		} else {
			return this._initState(newState).pipe(
				expand((state) => {
					// return state.activeQuestionInstances.length == 0 ? this._incrementNavigation(newState) : EMPTY;
					return state.activeQuestionInstances.length === 0 ? this._incrementNavigation(currentState) : EMPTY;
				})
			);
		}
	}

	/**
	 *
	 * @param state
	 */
	private _isOutsideSurveyBounds(state: NavigationState): boolean {
		return state.activeQuestionIndex >= this._state.viewerState.surveyQuestions.length;
	}

	/**
	 * Decrements the current navigation state.
	 * @param currentState
	 */
	private _decrementNavigation(currentState: NavigationState): Observable<NavigationState> {
		const newState: NavigationState = Object.assign({}, this.navigationState$.value);

		if (newState.activeQuestionInstances[0]?.component?.canNavigateInternalPrevious()) {
			newState.activeQuestionInstances[0].component.navigateInternalPrevious();
		} else if (newState.activeSection?.isHousehold && newState.activeRespondentIndex > 0) {
			newState.activeRespondentIndex--;
		} else {
			newState.activeRespondentIndex = 0;
			newState.activeQuestionIndex -= 1;
		}
		return this._initState(newState, false).pipe(
			expand((state) => {
				return state.activeQuestionInstances.length === 0 ? this._decrementNavigation(currentState) : EMPTY;
			}),
			takeWhile((v) => 1 === 1)
		);
	}

	/**
	 *
	 * @param navigationState
	 */
	private _initState(
		navigationState: NavigationState,
		evaluateConditions: boolean = true
	): Observable<NavigationState> {
		return new Observable((obs: Observer<NavigationState>) => {
			this._initQuestionInstancesForState(navigationState, evaluateConditions).subscribe((questionInstances) => {
				navigationState.activeQuestionInstances = questionInstances;

				if (questionInstances.length > 0) {
					navigationState.activePage = this._state.viewerState.surveyPages[
						navigationState.activeQuestionInstances[0]?.model.pageIndex
					];
					navigationState.activeSectionId = -1;
					navigationState.activeSectionId =
						navigationState.activeQuestionInstances[0]?.model.parentSection?.id;
					navigationState.activeSection = navigationState.activeQuestionInstances[0]?.model.parentSection;
					navigationState.activeRespondent = this._state.viewerState.groupMembers[
						navigationState.activeRespondentIndex
					];
					for (let question of navigationState.activeQuestionInstances) {
						question.validationState = {
							isValid: false,
							questionValidationState: {
								validationState: ValidationState.Untouched,
								errorMessages: [],
							},
							surveyLogicValidationState: {
								validationState: ValidationState.Untouched,
								errorMessages: [],
							},
						};
					}
				}

				obs.next(navigationState);
				obs.complete();
			});
		});
	}

	/**
	 *
	 * @param navigationState
	 * @param evaluateConditions
	 */
	private _initQuestionInstancesForState(
		navigationState: NavigationState,
		evaluateConditions: boolean = true
	): Observable<QuestionInstance[]> {
		let questions: SurveyViewQuestion[] = [];
		questions = questions.concat(this._state.viewerState.questionBlocks[navigationState.activeQuestionIndex]);
		this._state.viewerState.activeRespondent = this._state.viewerState.groupMembers[
			navigationState.activeRespondentIndex
		];

		if (navigationState.activeQuestionIndex >= this._state.viewerState.questionBlocks.length) {
			return Observable.of([]);
		} else {
			let questionInstances = [];
			let evals = [];
			for (let question of questions) {
				// determine if target conditionals are resolved
				evals.push(this._conditionalEvaluator.shouldHide(question, this._state.viewerState.activeRespondent));
			}
			return new Observable((obs) => {
				forkJoin(evals).subscribe(
					(
						results: Array<{
							shouldHide: boolean;
							question: SurveyViewQuestion;
						}>
					) => {
						let order = 0;
						for (let result of results) {
							result.question.isHidden = result.shouldHide;

							if (result.shouldHide) {
								continue;
							} else {
								result.question.inSectionIndex = order++;
							}

							let instanceId = this.getQuestionInstanceId(result.question);
							let prevIdx = findIndex(this.navigationState$.value.activeQuestionInstances, (instance) => {
								return instance.id === instanceId;
							});

							if (prevIdx >= 0) {
								questionInstances.push(this.navigationState$.value.activeQuestionInstances[prevIdx]);
							} else {
								let questionInstance: QuestionInstance = {
									id: instanceId,
									index: navigationState.activeQuestionIndex,
									model: result.question,
									component: null,
									questionInstanceState: null,
									validationState: {
										isValid: false,
										questionValidationState: {
											validationState: ValidationState.Untouched,
											errorMessages: [],
										},
										surveyLogicValidationState: {
											validationState: ValidationState.Untouched,
											errorMessages: [],
										},
									},
								};

								questionInstances.push(questionInstance);
							}
						}
						obs.next(questionInstances);
						obs.complete();
					}
				);
			});
		}
	}

	/**
	 *
	 * @param question
	 * @param repeat
	 */
	private getQuestionInstanceId(question: SurveyViewQuestion, repeat: number = 0): string {
		return `${question.id}_${repeat}`;
	}

	/**
	 *
	 */
	private get _currentState(): NavigationState {
		return this.navigationState$.getValue();
	}

	/**
	 *
	 */
	private _checkValidation(): boolean {
		let allValid: boolean = true;

		if (this._currentState.activeQuestionInstances.length === 0) {
			return false;
		}
		for (let instance of this._currentState.activeQuestionInstances) {
			if (!instance.validationState.isValid && !instance.model.isOptional) {
				allValid = false;
				break;
			}
		}
		return allValid;
	}

	/**
	 *
	 */
	public validationChanged(): void {
		this.nextEnabled$.next(this._checkValidation());
	}

	/**
	 * Updates the validation state in the navigation manager
	 * @param instanceState
	 * @param result
	 */
	public updateQuestionValidationState(
		instanceState: QuestionInstanceState,
		result: SurveyViewerValidationStateViewModel
	): void {
		let findId = this.getQuestionInstanceId(instanceState.guestionModel);
		let match = this._currentState.activeQuestionInstances.find(
			(i) => i.id === this.getQuestionInstanceId(instanceState.guestionModel)
		);
		if (match) {
			match.validationState = result;
			this.validationChanged();
		} else {
		}
	}

	/**
	 *
	 */
	public responseChanged(): void {
		// this._validationChanged
		// this._initState(this.navigationState$.getValue()).subscribe();
	}
}
