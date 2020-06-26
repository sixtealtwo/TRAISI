import { Injectable, Inject } from '@angular/core';
import { SurveyViewerState } from '../models/survey-viewer-state.model';
import {
	BehaviorSubject,
	ReplaySubject,
	Subject,
	Observable,
	Observer,
	forkJoin,
	AsyncSubject,
	EMPTY,
	of,
	pipe,
	empty,
} from 'rxjs';
import { ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewGroupMember } from '../models/survey-view-group-member.model';
import { SurveyViewQuestion } from '../models/survey-view-question.model';
import { NavigationStart } from '@angular/router';
import { NavigationState } from 'app/models/navigation-state.model';

@Injectable({
	providedIn: 'root',
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
	public constructor() {
		this.viewerState = {
			surveyPages: [],
			pageStates: {},
			sectionStates: {},
			activePage: undefined,
			surveyQuestions: [],
			surveyQuestionsFull: [],
			activeQuestionIndex: -1,
			activePageIndex: -1,
			groupMembers: [],
			activeGroupMemberIndex: -1,
			activeRepeatIndex: -1,
			activeRespondent: undefined,
			primaryRespondent: undefined,
			activeGroupQuestions: [],
			isNavProcessing: false,
			questionMap: {},
			questionViewMap: {},
			questionTypeMap: {},
			sectionMap: {},
			questionBlocks: [],
			questionTree: [],
			questionNameMap: {},
		};

		this.surveyViewerState = new ReplaySubject<SurveyViewerState>();
		this.surveyQuestionsChanged = new Subject<string>();
	}

	public initialize(): void {
		// loop over each
		for (let page of this.viewerState.surveyPages) {
			this.viewerState.pageStates[page.id] = {
				isCompleted: false,
				isVisited: false,
			};
		}
	}

	public updateStates(navState: NavigationState): void {
		if (navState.activePage) {
			this.viewerState.pageStates[navState.activePage?.id].isVisited = true;
		}
		console.log(this.viewerState); 
	}
}
