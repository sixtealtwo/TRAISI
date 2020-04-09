import { Injectable, Inject } from '@angular/core';
import { SurveyViewerState } from '../models/survey-viewer-state.model';
import { BehaviorSubject, ReplaySubject, Subject, Observable, Observer, forkJoin, AsyncSubject, EMPTY, of, pipe, empty } from 'rxjs';
import { ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewGroupMember } from '../models/survey-view-group-member.model';
import { SurveyViewQuestion } from '../models/survey-view-question.model';
import { ConditionalEvaluator } from './conditional-evaluator/conditional-evaluator.service';
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
	 * Creates an instance of survey viewer state service.
	 * @param _conditionalEvaluator
	 * @param _responderService
	 */
	public constructor(@Inject('SurveyResponderService') private _responderService: SurveyResponderService) {
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
			activeViewContainerIndex: -1,
			isPreviousEnabled: false,
			isNextEnabled: false,
			isNavComplete: false,
			isNavProcessing: false,
			isNavFinished: false,
			isPreviousActionNext: true,
			questionMap: {},
			questionViewMap: {},
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
	 * Updates active questions based on the last updated question id.
	 * @param updatedQuestionId
	 */
	public evaluateConditionals(updatedQuestionId: number, respondentId: number): Observable<{}> {
		return EMPTY;
	}
}
