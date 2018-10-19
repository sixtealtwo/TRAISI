import { Injectable } from '@angular/core';
import { SurveyViewerState } from '../models/survey-viewer-state.model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewGroupMember } from '../models/survey-view-group-member.model';
@Injectable({
	providedIn: 'root'
})
export class SurveyResponderService {
	private _viewerState: SurveyViewerState;

	public surveyViewerState: ReplaySubject<SurveyViewerState>;

	public constructor() {
		this._viewerState = {
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
			groupValidationStates: {},
			isLoaded: false
		};

		this.surveyViewerState = new ReplaySubject<SurveyViewerState>();
	}

	/**
	 * Determines whether loaded is
	 * @param flag
	 */
	public isLoaded(flag: boolean): void {
		this._viewerState.isLoaded = flag;
	}

	/**
	 * Sets group member question validation state
	 * @param groupMember
	 * @param state
	 */
	public setGroupQuestionValidationState(memberIndex: number, state: ResponseValidationState): void {
		this._viewerState.groupValidationStates[memberIndex] = state;
	}
}
