import { Injectable } from '@angular/core';
import { SurveyViewerStateService } from '../../../../services/survey-viewer-state.service';
import { Subject, Observable, Observer, BehaviorSubject, EMPTY, forkJoin } from 'rxjs';
import { NavigationState } from '../../../../models/navigation-state.model';
import { QuestionInstance } from 'app/models/question-instance.model';
import { SurveyViewPage } from 'app/models/survey-view-page.model';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { findIndex, every } from 'lodash';
import { expand, share, tap } from 'rxjs/operators';
import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { ConditionalEvaluator } from 'app/services/conditional-evaluator/conditional-evaluator.service';
import { ResponseValidationState } from 'traisi-question-sdk';

/**
 *
 *
 * @export
 * @class SurveyNavigator
 */
@Injectable({
	providedIn: 'root'
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
	 *
	 *
	 * @type {BehaviorSubject<boolean>}
	 */
	public previousEnabled$: BehaviorSubject<boolean>;

	/**
	 *
	 *
	 * @type {BehaviorSubject<boolean>}
	 */
	public nextEnabled$: BehaviorSubject<boolean>;

	/**
	 *Creates an instance of SurveyNavigator.
	 * @param {SurveyViewerStateService} _surveyState
	 * @memberof SurveyNavigator
	 */
	public constructor(private _state: SurveyViewerStateService, private _conditionalEvaluator: ConditionalEvaluator) {
		this.navigationStateChanged = new Subject<NavigationState>();
		let initialState: NavigationState = {
			activeQuestionInstances: [],
			isLoaded: false,
			activeQuestionIndex: 0,
			isNextEnabled: true,
			isPreviousEnabled: true
		};

		this.navigationState$ = new BehaviorSubject<NavigationState>(initialState);
		this.previousEnabled$ = new BehaviorSubject<boolean>(false);
		this.nextEnabled$ = new BehaviorSubject<boolean>(false);
		this.navigationStateChanged.next(initialState);
	}

	/** */
	public initialize(): void {
		this.navigateToPage(this._state.viewerState.surveyPages[0].id).subscribe();
		this.nextEnabled$.next(true);
	}

	public _getBaseQuestionModels(part: SurveyViewPage | SurveyViewSection): SurveyViewQuestion[] {
		let questions = [];
		questions = questions.concat(part.questions);
		return questions;
	}

	/**
	 *
	 */
	public navigateNext(): Observable<NavigationState> {
		let nav = this._incrementNavigation(this.navigationState$.value).pipe(share());
		nav.subscribe(state => {
			this.previousEnabled$.next(true);
			this.navigationState$.next(state);
		});
		return nav;
	}

	/**
	 *
	 */
	public navigatePrevious(): Observable<NavigationState> {
		let prev = this._decrementNavigation(this.navigationState$.value).pipe(share());
		prev.subscribe(state => {
			if (state.activeQuestionIndex === 0) {
				this.previousEnabled$.next(false);
			}

			if (this._isMultiViewActive(state)) {
				state.activeQuestionIndex -= this._state.viewerState.surveyQuestions[
					state.activeQuestionIndex
				].parentSection.questions.length - 1;
			}
			this.navigationState$.next(state);

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
	 * @param pageId
	 */
	public navigateToPage(pageId: number): Observable<NavigationState> {
		let pageIndex = findIndex(this._state.viewerState.surveyPages, page => {
			return page.id === pageId;
		});

		return new Observable((obs: Observer<NavigationState>) => {
			let navigationState: NavigationState = {
				activePage: this._state.viewerState.surveyPages[pageIndex],
				activeSectionIndex: -1,
				activeSectionId: -1,
				activeQuestionIndex: 0,
				activeQuestionInstances: [],
				isLoaded: true,
				isNextEnabled: true,
				isPreviousEnabled: true
			};

			this._initState(navigationState).subscribe(r => {
				this.navigationState$.next(r);
				obs.next(r);
				obs.complete();
			});

			this._initQuestionInstancesForState(navigationState).subscribe(questionInstances => {
				navigationState.activeQuestionInstances = questionInstances;

			});
		});
	}

	/**
	 *
	 * @param state
	 */
	private _isMultiViewActive(state: NavigationState): boolean {
		if (state.activeQuestionInstances[0].model.parentSection !== undefined) {
			return state.activeQuestionInstances[0].model.parentSection.isMultiView;
		} else {
			return false;
		}
	}

	/**
	 * Increments the current navigation state
	 * @param currentState
	 */
	private _incrementNavigation(currentState: NavigationState): Observable<NavigationState> {
		const newState: NavigationState = Object.assign({}, this.navigationState$.value);

		if (!this._isMultiViewActive(currentState)) {
			newState.activeQuestionIndex += 1;
		} else {
			newState.activeQuestionIndex += this._state.viewerState.surveyQuestions[
				currentState.activeQuestionIndex
			].parentSection.questions.length;
		}

		return this._initState(newState).pipe(
			expand(state => {
				// return state.activeQuestionInstances.length == 0 ? this._incrementNavigation(newState) : EMPTY;
				return state.activeQuestionInstances.length === 0 ? EMPTY : EMPTY;
			})
		);
	}

	/**
	 * Decrements the current navigation state.
	 * @param currentState
	 */
	private _decrementNavigation(currentState: NavigationState): Observable<NavigationState> {
		const newState: NavigationState = Object.assign({}, this.navigationState$.value);
		newState.activeQuestionIndex -= 1;
		return this._initState(newState).pipe(
			expand(state => {
				return state.activeQuestionInstances.length === 0 ? EMPTY : EMPTY;
			})
		);
	}



	/**
	 *
	 * @param navigationState
	 */
	private _initState(navigationState: NavigationState): Observable<NavigationState> {
		return new Observable((obs: Observer<NavigationState>) => {
			this._initQuestionInstancesForState(navigationState)
				.pipe(share())
				.subscribe(questionInstances => {
					navigationState.activeQuestionInstances = questionInstances;

					if (questionInstances.length > 0) {
						navigationState.activePage = this._state.viewerState.surveyPages[
							this._state.viewerState.surveyQuestions[questionInstances[0].index].pageIndex
						];
						navigationState.activeSectionId =
							this._state.viewerState.surveyQuestions[questionInstances[0].index].parentSection === undefined
								? -1
								: this._state.viewerState.surveyQuestions[questionInstances[0].index].parentSection.id;

						navigationState.activeSection =
							this._state.viewerState.surveyQuestions[questionInstances[0].index].parentSection === undefined
								? undefined
								: this._state.viewerState.surveyQuestions[questionInstances[0].index].parentSection;
					}

					obs.next(navigationState);
					obs.complete();
				});
		});
	}

	/**
	 *
	 * @param navigationState
	 */
	private _initQuestionInstancesForState(navigationState: NavigationState): Observable<QuestionInstance[]> {
		console.log(navigationState);
		let activeQuestion = this._state.viewerState.surveyQuestions[navigationState.activeQuestionIndex];
		let questions: SurveyViewQuestion[] = [];
		if (activeQuestion.parentPage !== undefined) {
			questions.push(activeQuestion);
		} else {
			questions = questions.concat(activeQuestion.parentSection.questions);
		}

		if (navigationState.activeQuestionIndex >= this._state.viewerState.surveyQuestions.length) {
			return Observable.of([]);
		} else {
			let questionInstances = [];
			let evals = [];
			for (let question of questions) {
				// determine if target conditionals are resolved
				evals.push(this._conditionalEvaluator.shouldHide(question, this._state.viewerState.activeRespondent.id));
			}

			return new Observable(obs => {
				forkJoin(evals).subscribe((results: Array<{ shouldHide: boolean; question: SurveyViewQuestion }>) => {
					for (let result of results) {
						if (result.shouldHide) {
							continue;
						}
						let questionInstance: QuestionInstance = {
							id: '' + result.question.id,
							index: navigationState.activeQuestionIndex,
							model: result.question,
							validationState: ResponseValidationState.PRISTINE
						};
						questionInstances.push(questionInstance);
					}
					obs.next(questionInstances);
					obs.complete();
				});
			});
		}
	}

	private _checkValidation(): boolean {
		// let valid = every(this.navigationState$.value.activeQuestionInstances, { 'validationState': ResponseValidationState.VALID });
		let allValid: boolean = true;
		for (let instance of this.navigationState$.getValue().activeQuestionInstances) {
			if (instance.validationState !== ResponseValidationState.VALID) {
				allValid = false;
				break;
			}
		}

		return allValid;
	}

	/**
	 *
	 */
	public responseChanged(): void {
		this._initState(this.navigationState$.getValue())
			.pipe(
				share()).subscribe(() => {
					setTimeout(() => {
						this.nextEnabled$.next(this._checkValidation());
					});

				});
	}
}
