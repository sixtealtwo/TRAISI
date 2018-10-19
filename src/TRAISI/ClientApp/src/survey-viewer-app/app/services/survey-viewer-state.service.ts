import { Injectable } from '@angular/core';
import { SurveyViewerState } from '../models/survey-viewer-state.model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewGroupMember } from '../models/survey-view-group-member.model';
import { QuestionContainerComponent } from '../components/question-container/question-container.component';
import { SurveyViewQuestion } from '../models/survey-view-question.model';
@Injectable({
	providedIn: 'root'
})
export class SurveyViewerStateService {
	public viewerState: SurveyViewerState;

	public surveyViewerState: ReplaySubject<SurveyViewerState>;

	public constructor() {
		this.viewerState = {
			surveyPages: [],
			activeQuestion: undefined,
			activeSection: undefined,
			activePage: undefined,
			isSectionActive: false,
			surveyQuestions: [],
			activeQuestionIndex: -1,
			activePageIndex: -1,
			groupMembers: [],
			activeGroupMemberIndex: -1,
			primaryRespondent: undefined,
			activeGroupQuestions: [],
			isLoaded: false
		};

		this.surveyViewerState = new ReplaySubject<SurveyViewerState>();
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
		let index = this.viewerState.activeGroupQuestions.findIndex((f) => f.viewId === question.viewId);

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
		groupMembers.forEach((member) => {
			let memberQuestion = Object.assign({}, activeQuestion);
			memberQuestion.viewId = Symbol();
			memberQuestion.parentMember = member;
			this.viewerState.activeGroupQuestions.push(memberQuestion);
		});

		// this.surveyViewerState.next(this.viewerState);
	}
}
