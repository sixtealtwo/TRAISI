import { Injectable, Inject } from '@angular/core';
import { SurveyViewerState } from '../models/survey-viewer-state.model';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewGroupMember } from '../models/survey-view-group-member.model';
import { QuestionContainerComponent } from '../components/question-container/question-container.component';
import { SurveyViewQuestion } from '../models/survey-view-question.model';
import { SurveyViewerConditionalEvaluator } from './survey-viewer-conditional-evaluator.service';
import { EventEmitter } from 'events';
import { SurveyViewConditional } from 'app/models/survey-view-conditional.model';
import { SurveyResponderService } from './survey-responder.service';
@Injectable({
	providedIn: 'root'
})
export class SurveyViewerStateService {
	public static readonly SURVEY_QUESTIONS_CHANGED: string = 'SURVEY_QUESTIONS_CHANGED';

	public viewerState: SurveyViewerState;

	public surveyViewerState: ReplaySubject<SurveyViewerState>;

	public surveyQuestionsChanged: Subject<string>;

	/**
	 *
	 * @param _conditionalEvaluator
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
			primaryRespondent: undefined,
			activeGroupQuestions: [],
			isLoaded: false,
			questionMap: {}
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
	public setGroupQuestionValidationState(memberIndex: number, state: ResponseValidationState): void {}

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
	public updateGroupQuestionValidationState(
		question: SurveyViewQuestion,
		validationState: ResponseValidationState
	): void {
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
	public setActiveGroupQuestions(
		activeQuestion: SurveyViewQuestion,
		groupMembers: Array<SurveyViewGroupMember>
	): void {
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
	 * Updates active questions based on the last updated question id.
	 * @param updatedQuestionId
	 */
	public evaluateConditionals(updatedQuestionId: number, respondentId: number): void {
		if (this.viewerState.questionMap[updatedQuestionId].sourceConditionals === undefined) {
			return;
		} else {
			let evaluatedConditionals: Array<SurveyViewConditional> = this.viewerState.questionMap[
				updatedQuestionId
			].sourceConditionals.filter((conditional: SurveyViewConditional) => {
				return this._conditionalEvaluator.evaluateConditional(
					conditional.conditionalType,
					this._responderService.getCachedSavedResponse(updatedQuestionId, respondentId),
					null,
					conditional.value
				);
			});
			if (evaluatedConditionals.length > 0) {
				console.log('some conditioanls true');
				// if some conditional evaluated to true - update the visible survey questions and emit an event to notify there was a change

				evaluatedConditionals.forEach(conditional => {
					const index: number = this.viewerState.surveyQuestions.findIndex(
						sq => sq.questionId === conditional.targetQuestionId
					);
					if (index >= 0) {
						this.viewerState.surveyQuestions.splice(index, 1);
					}
				});
				this.surveyQuestionsChanged.next(SurveyViewerStateService.SURVEY_QUESTIONS_CHANGED);
			} else {
				console.log('hh');
			}

			return;
		}
	}
}
