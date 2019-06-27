import { Injectable } from '@angular/core';
import { SurveyViewerStateService } from '../../../../services/survey-viewer-state.service';
import { Subject, Observable, Observer, BehaviorSubject, EMPTY, forkJoin } from 'rxjs';
import { NavigationState } from '../../../../models/navigation-state.model';
import { QuestionInstance } from 'app/models/question-instance.model';
import { SurveyViewPage } from 'app/models/survey-view-page.model';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { findIndex } from 'lodash';
import { expand, share } from 'rxjs/operators';
import { SurveyViewSection } from 'app/models/survey-view-section.model';
import { ConditionalEvaluator } from '../../../../services/conditional-evaluator/conditional-evaluator.service';

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

	public previousEnabled$: BehaviorSubject<boolean>;

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
		this.navigationStateChanged.next(initialState);
	}

	/** */
	public initialize(): void {
		this.navigateToPage(this._state.viewerState.surveyPages[0].id).subscribe();
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
			if(state.activeQuestionIndex === 0)
			{
				this.previousEnabled$.next(false);
			}
			this.navigationState$.next(state);
		});
		return prev;
	}

	public navigateToQuestion(questionId: number): Observable<NavigationState> {
		return new Observable((obs: Observer<NavigationState>) => {
			obs.complete();
		});
	}

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

	private _isMultiViewActive(state: NavigationState): boolean {
		if (state.activeQuestionInstances[0].model.parentSection !== undefined) {
			return state.activeQuestionInstances[0].model.parentSection.isMultiView;
		} else {
			return false;
		}
	}

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
	 *
	 * @param currentState
	 */
	private _decrementNavigation(currentState: NavigationState): Observable<NavigationState> {
		const newState: NavigationState = Object.assign({}, this.navigationState$.value);
		// if (!this._isMultiViewActive(currentState)) {
		if (!this._isMultiViewActive(currentState)) {
			newState.activeQuestionIndex -= 1;
		} else {
			newState.activeQuestionIndex -= this._state.viewerState.surveyQuestions[
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

			return Observable.create(obs => {
				forkJoin(evals).subscribe((results: Array<{ shouldHide: boolean; question: SurveyViewQuestion }>) => {
					for (let result of results) {
						if (result.shouldHide) {
							continue;
						}
						let questionInstance: QuestionInstance = {
							id: '' + result.question.id,
							index: navigationState.activeQuestionIndex,
							model: result.question
						};
						questionInstances.push(questionInstance);
					}
					obs.next(questionInstances);
					obs.complete();
				});
			});
		}
	}

	public responseChanged(): void {
		this._initState(this.navigationState$.value)
			.pipe(share())
			.subscribe();
	}
}
