import { Injectable, Inject } from '@angular/core';
import { SurveyViewerState } from '../models/survey-viewer-state.model';
import { BehaviorSubject, ReplaySubject, Subject, Observable, Observer, forkJoin, AsyncSubject, EMPTY, of, pipe, empty } from 'rxjs';
import { ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewGroupMember } from '../models/survey-view-group-member.model';
import { QuestionContainerComponent } from '../components/question-container/question-container.component';
import { SurveyViewQuestion } from '../models/survey-view-question.model';
import { SurveyViewerConditionalEvaluator } from './survey-viewer-conditional-evaluator.service';
import { EventEmitter } from 'events';
import { SurveyViewConditional } from 'app/models/survey-view-conditional.model';
import { SurveyResponderService } from './survey-responder.service';
import { SurveySectionRepeatContainer } from './survey-viewer-navigation/survey-section-repeat-container';
import { SurveyPageContainer } from './survey-viewer-navigation/survey-page-container';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerStateService {
	public static readonly SURVEY_QUESTIONS_CHANGED: string = 'SURVEY_QUESTIONS_CHANGED';

	public viewerState: SurveyViewerState;

	public surveyViewerState: ReplaySubject<SurveyViewerState>;

	public surveyQuestionsChanged: Subject<string>;

	/**
	 * Creates an instance of survey viewer state service.
	 * @param _conditionalEvaluator
	 * @param _responderService
	 */
	public constructor(
		private _conditionalEvaluator: SurveyViewerConditionalEvaluator,
		@Inject('SurveyResponderService') private _responderService: SurveyResponderService
	) {
		this.viewerState = {
			surveyPages: [],
			activeQuestion: undefined,
			activeSection: undefined,
			activePage: undefined,
			isSectionActive: false,
			surveyQuestions: [],
			surveyQuestionsFull: [],
			activeQuestionIndex: -1,
			activePageIndex: -1,
			groupMembers: [],
			activeGroupMemberIndex: -1,
			activeRepeatIndex: -1,
			activeInSectionIndex: 0,
			activeRespondent: undefined,
			primaryRespondent: undefined,
			activeGroupQuestions: [],
			isLoaded: false,
			isQuestionLoaded: false,
			viewContainers: [],
			activeViewContainer: undefined,
			activeViewContainerIndex: -1,
			activeQuestionContainer: undefined,
			isPreviousEnabled: false,
			isNextEnabled: false,
			isNavComplete: false,
			isNavProcessing: false,
			isNavFinished: false,
			isPreviousActionNext: true,
			activeSectionRepeatContainer: undefined,
			questionMap: {},
			activeQuestionContainers: [],
			questionNavIndex: 0,
			sectionMap: {}
		};

		this.surveyViewerState = new ReplaySubject<SurveyViewerState>();
		this.surveyQuestionsChanged = new Subject<string>();
	}

	/**
	 * Determines whether loaded is
	 * @param flag
	 */
	public isLoaded(flag: boolean): void {
		this.viewerState.isLoaded = flag;
	}

	/**
	 * Sets group member question validation state
	 * @param groupMember
	 * @param state
	 */
	public setGroupQuestionValidationState(memberIndex: number, state: ResponseValidationState): void { }

	/**
	 * Sets active question
	 * @param question
	 */
	public setActiveQuestion(question: SurveyViewQuestion): void {
		this.viewerState.activeQuestion = question;
		this.surveyViewerState.next(this.viewerState);
	}

	/**
	 * Updates state
	 * @param state
	 */
	public updateState(state: SurveyViewerState): void {
		this.viewerState = state;
		// this.surveyViewerState.next(this.viewerState);
	}

	/**
	 * Updates group question validation state
	 * @param question
	 * @param validationState
	 */
	public updateGroupQuestionValidationState(question: SurveyViewQuestion, validationState: ResponseValidationState): void {
		let index = this.viewerState.activeGroupQuestions.findIndex(f => f.viewId === question.viewId);

		if (index >= 0) {
			this.viewerState.activeGroupQuestions[index].validationState = validationState;
		} else {
		}
		// this.surveyViewerState.next(this.viewerState);
	}

	/**
	 * Sets active group questions
	 * @param groupMembers
	 */
	public setActiveGroupQuestions(activeQuestion: SurveyViewQuestion, groupMembers: Array<SurveyViewGroupMember>): void {
		this.viewerState.activeGroupQuestions = [];
		groupMembers.forEach(member => {
			let memberQuestion = Object.assign({}, activeQuestion);
			memberQuestion.viewId = Symbol();
			memberQuestion.parentMember = member;
			this.viewerState.activeGroupQuestions.push(memberQuestion);
		});

		// this.surveyViewerState.next(this.viewerState);
	}

	/**
	 * Evaluates repeat
	 * @param activeQuestion
	 */
	public evaluateRepeat(activeQuestion: SurveyViewQuestion, respondentId: number): Observable<{}> {
		if (activeQuestion.repeatTargets.length === 0) {
			return of();
		}
		return Observable.create(observer => {
			this._responderService.readyCachedSavedResponses([activeQuestion.questionId], respondentId).subscribe(result => {
				for (let repeatTarget of activeQuestion.repeatTargets) {
					const response: any = this._responderService.getCachedSavedResponse(activeQuestion.questionId, respondentId)[0].value;

					if (typeof response === 'number') {
						const responseInt: number = Math.round(response);

						let targetQuestion: SurveyViewQuestion = this.viewerState.questionMap[repeatTarget];
						if (targetQuestion !== undefined) {
							targetQuestion.repeatChildren = {};
							targetQuestion.repeatChildren[respondentId] = [];
							targetQuestion.repeatNumber = 0;
							for (let i: number = 0; i < responseInt - 1; i++) {
								let duplicate: SurveyViewQuestion = Object.assign({}, targetQuestion);
								duplicate.repeatNumber = i + 1;
								targetQuestion.repeatChildren[respondentId].push(duplicate);
							}
						} else {
							let targetSection = this.viewerState.sectionMap[repeatTarget];
							let container = this.findSectionRepeatContainer(targetSection.id);

							let page = this.findSectionRepeatContainerPage(targetSection.id);
							if (responseInt >= 0) {
								// container.isRepeatHidden = false;
								let dups: Array<SurveySectionRepeatContainer> = [];
								let questions = [];
								if (container !== null) {
									questions = questions.concat(container.listChildQuestions());
								} else {
									questions = questions.concat(targetSection.questions);
								}
								let order = targetSection.order;
								for (let i: number = 0; i < responseInt; i++) {
									// let duplicate: SurveySectionRepeatContainer = Object.create(container);
									// duplicate.initialize();

									let sectionRepeat = SurveySectionRepeatContainer.CreateSurveySectionRepeatFromModel(
										targetSection,
										this
									);

									sectionRepeat.repeatIndex = i;
									for (let question of questions) {
										sectionRepeat.createQuestionContainer(question, this.viewerState.primaryRespondent);
									}
									sectionRepeat.order = order;
									order += 0.01;
									dups.push(sectionRepeat);
								}

								let filtered = page.children.filter(p => {
									if (p.sectionModel === null || p.sectionModel === undefined) {
										return true;
									} else if (p.sectionModel.id === targetSection.id) {
										return false;
									}
									return true;
								});
								page.children = filtered;

								if (responseInt > 0) {
									let total = page.children.length;
									let inserted: boolean = false;
									for (let i = 0; i < total - 1; i++) {
										if (
											page.children[i].order <= targetSection.order &&
											page.children[i + 1].order >= targetSection.order
										) {
											page.children.splice(i + 1, 0, ...dups);
											inserted = true;
											break;
										}
									}
									if (!inserted) {
										page.children = page.children.concat(...dups);
									}
								}

								// insert filtered in the right location
							} else {
								container.isRepeatHidden = true;
							}
						}
					}
					observer.complete();
				}
			});
		});
	}

	/**
	 * Finds section repeat container
	 * @param sectionId
	 * @returns section repeat container
	 */
	public findSectionRepeatContainer(sectionId: number): SurveySectionRepeatContainer {
		for (let page of this.viewerState.viewContainers) {
			for (let sec of page.children) {
				if (sec.sectionModel !== null && sec.sectionModel.id === sectionId) {
					return sec;
				}
			}
		}
		return null;
	}

	/**
	 * Finds section repeat container page
	 * @param sectionId
	 * @returns section repeat container page
	 */
	public findSectionRepeatContainerPage(sectionId: number): SurveyPageContainer {
		for (let page of this.viewerState.viewContainers) {
			for (let sec of page.children) {
				if (sec.sectionModel !== null && sec.sectionModel.id === sectionId) {
					return page;
				}
			}
		}

		for (let i = 0; i < this.viewerState.surveyPages.length; i++) {
			let page = this.viewerState.surveyPages[i];
			for (let s of page.sections) {
				if (s.id === sectionId) {
					return this.viewerState.viewContainers[i];
				}
			}
		}

		return null;
	}

	/**
	 * Finds active survey section repeat container
	 * @returns active survey section repeat container
	 */
	public findActiveSurveySectionRepeatContainer(): SurveySectionRepeatContainer {
		return <SurveySectionRepeatContainer>this.viewerState.activeViewContainer;
	}

	/**
	 * Updates active questions based on the last updated question id.
	 * @param updatedQuestionId
	 */
	public evaluateConditionals(updatedQuestionId: number, respondentId: number): Observable<{}> {
		return Observable.create(observer => {
			if (
				this.viewerState.questionMap[updatedQuestionId] === undefined ||
				this.viewerState.questionMap[updatedQuestionId].sourceConditionals.length === 0
			) {
				setTimeout(() => {
					observer.complete();
				});
			} else {
				let conditionalEvals = [];
				this.viewerState.questionMap[updatedQuestionId].sourceConditionals.forEach(conditional => {
					let targetQuestion = this.viewerState.questionMap[conditional.targetQuestionId];

					let sourceQuestionIds: number[] = [];

					targetQuestion.targetConditionals.forEach(targetConditional => {
						sourceQuestionIds.push(targetConditional.sourceQuestionId);
					});


					conditionalEvals.push(this._responderService.readyCachedSavedResponses(sourceQuestionIds, respondentId));

				});

				forkJoin(conditionalEvals).subscribe(values => {
					this.viewerState.questionMap[updatedQuestionId].sourceConditionals.forEach(conditional => {
						let targetQuestion = this.viewerState.questionMap[conditional.targetQuestionId];

						let evalTrue: boolean = targetQuestion.targetConditionals.some(evalConditional => {
							let response = this._responderService.getCachedSavedResponse(evalConditional.sourceQuestionId, respondentId);

							if (response === undefined || response.length == 0) {
								return;
							}
							let evalResult = this._conditionalEvaluator.evaluateConditional(
								evalConditional.conditionalType,
								response,
								'',
								evalConditional.value
							);
							return evalResult;
						});

						if (targetQuestion.isRespondentHidden === undefined) {
							targetQuestion.isRespondentHidden = {};
						}
						targetQuestion.isRespondentHidden[respondentId] = evalTrue;
						targetQuestion.isHidden = evalTrue;
					});
					observer.complete();
				});
			}
		});
	}
}
