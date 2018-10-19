import {
	Component,
	OnInit,
	ViewChild,
	ViewContainerRef,
	ComponentFactory,
	SystemJsNgModuleLoader,
	Inject,
	ChangeDetectorRef,
	QueryList,
	AfterViewInit,
	AfterContentInit,
	ViewChildren,
	ContentChildren,
	AfterContentChecked,
	AfterViewChecked,
	HostListener
} from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { ActivatedRoute, Params } from '@angular/router';
import { SurveyViewPage } from '../../models/survey-view-page.model';
import { SurveyHeaderDisplayComponent } from '../survey-header-display/survey-header-display.component';
import { sortBy } from 'lodash';
import { QuestionContainerComponent } from '../question-container/question-container.component';
import { SurveyQuestion, ResponseValidationState } from 'traisi-question-sdk';
import { SurveyViewQuestion } from '../../models/survey-view-question.model';
import { SurveyViewSection } from '../../models/survey-view-section.model';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyResponderService } from '../../services/survey-responder.service';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
@Component({
	selector: 'traisi-survey-viewer',
	templateUrl: './survey-viewer.component.html',
	styleUrls: ['./survey-viewer.component.scss']
})
export class SurveyViewerComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked {
	public questions: Array<SurveyViewQuestion>;

	public surveyId: number;

	public titleText: string;

	@ViewChild(SurveyHeaderDisplayComponent)
	public headerDisplay: SurveyHeaderDisplayComponent;

	@ViewChildren('questions')
	public questionContainers!: QueryList<QuestionContainerComponent>;

	public activeQuestion: any;

	public activeQuestionIndex: number = -1;

	public activeSectionIndex: number = -1;

	public activePageIndex: number = -1;

	public isLoaded: boolean = false;

	public isSection: boolean = false;

	public navigatePreviousEnabled: boolean = false;

	public navigateNextEnabled: boolean = false;

	private navigationActiveState: boolean = true;

	private _activeQuestionContainer: QuestionContainerComponent;

	public ref: SurveyViewerComponent;

	public activeSection: SurveyViewSection;

	public viewerState: SurveyViewerState;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponderService,
		private questionLoaderService: QuestionLoaderService,
		private route: ActivatedRoute,
		private cdRef: ChangeDetectorRef
	) {
		this.ref = this;
	}

	/**
	 * Initialization
	 */
	public ngOnInit(): void {
		// this.surveyViewerService.getWelcomeView()

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
			groupValidationStates: {},
			isLoaded: false
		};

		this.titleText = this.surveyViewerService.activeSurveyTitle;

		this.route.queryParams.subscribe((value: Params) => {
			this.surveyViewerService.activeSurveyId.subscribe((surveyId: number) => {
				this.surveyId = surveyId;

				this.surveyViewerService.getSurveyViewPages(this.surveyId).subscribe((pages: SurveyViewPage[]) => {
					this.headerDisplay.pages = pages;

					this.loadQuestions(pages);
				});
			});
		});

		// subscribe to the navigation state change that is alterable by sub questions
		this.surveyViewerService.navigationActiveState.subscribe(this.onNavigationStateChanged);
	}

	/**
	 * Loads questions
	 * @param pages
	 */
	private loadQuestions(pages: Array<SurveyViewPage>): void {
		this.questions = [];
		let pageCount: number = 0;
		let viewOrder: number = 0;
		this.viewerState.surveyPages = pages;
		pages.forEach((page) => {
			page.questions.forEach((question) => {
				question.pageIndex = pageCount;
				question.viewOrder = viewOrder;
				question.parentPage = page;
				this.questions.push(question);

				viewOrder++;
			});
			page.sections.forEach((section) => {
				section.questions.forEach((question) => {
					question.pageIndex = pageCount;
					question.viewOrder = viewOrder;
					question.parentSection = section;
					this.questions.push(question);
					viewOrder++;
				});
			});
			pageCount += 1;
		});

		this.activeQuestionIndex = 0;
		this.activePageIndex = 0;
		this.questions = sortBy(this.questions, ['viewOrder']);

		this.viewerState.surveyQuestions = sortBy(this.questions, ['viewOrder']);

		this.viewerState.activeQuestionIndex = 0;
		this.viewerState.activePageIndex = 0;

		this._surveyResponderService.getSurveyGroupMembers().subscribe((members: Array<SurveyViewGroupMember>) => {
			if (members.length > 0) {
				this.viewerState.primaryRespondent = members[0];
				this.isLoaded = true;
			}
		});
	}

	/**
	 *
	 * @param state
	 */
	private onNavigationStateChanged: (state: boolean) => void = (state: boolean) => {
		this.navigationActiveState = state;
		this.validateNavigation();
	};

	/**
	 * Navigate questions - next question in the questions list.
	 */
	public navigateNext(): void {
		if (!this.validateInternalNavigationNext()) {
			this.activeQuestionIndex += 1;
			this.viewerState.activeQuestionIndex++;

			this.updateViewerState();
			this.validateNavigation();
		} else {
			const result = this._activeQuestionContainer.surveyQuestionInstance.navigateInternalNext();

			if (result) {
				this.activeQuestionIndex += 1;
				this.viewerState.activeQuestionIndex++;
				this.updateViewerState();
			}

			this.validateNavigation();
		}
	}

	/**
	 * Updates viewer state
	 */
	private updateViewerState(): void {
		this.viewerState.activeQuestion = this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex];

		if (this.viewerState.activeQuestion.parentSection !== undefined) {
			this.viewerState.activeSection = this.viewerState.activeQuestion.parentSection;
			this.viewerState.isSectionActive = true;
			this.viewerState.activeGroupMemberIndex = 0;
		} else {
			this.viewerState.activeSection = null;
			this.viewerState.isSectionActive = false;
			this.viewerState.activeGroupMemberIndex = -1;

			// clear the group members to prevent rendering
			this.viewerState.groupMembers = [];
		}

		this.updateRespondentGroup();
	}

	/**
	 * Shows group member
	 * @param memberIndex
	 */
	public showGroupMember(memberIndex: number): void {
		this.viewerState.activeGroupMemberIndex = memberIndex;
	}

	/**
	 *
	 */
	private callVisibilityHooks(): void {
		if (this._activeQuestionContainer !== undefined) {
			if (this._activeQuestionContainer.surveyQuestionInstance != null) {
				if ((<any>this._activeQuestionContainer.surveyQuestionInstance).__proto__.hasOwnProperty('onQuestionShown')) {
					(<any>this._activeQuestionContainer.surveyQuestionInstance).onQuestionShown();
				}
			}
		}
	}

	/**
	 * Performs a check on the current question for its status as a group / or section for rendering household members
	 */
	private updateRespondentGroup(): void {
		if (this.viewerState.isSectionActive) {
			if (this.viewerState.activeSection.isHousehold) {
				this._surveyResponderService.getSurveyGroupMembers().subscribe((group: any) => {
					console.log(' got group ');
					console.log(group);

					this.viewerState.groupMembers = group;
				});
			}
		}
	}

	/**
	 * Navigate questions - to the previous item in the question list
	 */
	public navigatePrevious(): void {
		if (!this.validateInternalNavigationPrevious()) {
			this.viewerState.activeQuestionIndex -= 1;
			this.navigationActiveState = true;
			this.updateViewerState();
			this.validateNavigation();
		} else {
			this._activeQuestionContainer.surveyQuestionInstance.navigateInternalPrevious();
		}
	}

	/**
	 * Validates internal navigation next
	 * @returns true if internal navigation next
	 */
	private validateInternalNavigationNext(): boolean {
		if (this._activeQuestionContainer.surveyQuestionInstance != null) {
			return (this.navigateNextEnabled = this._activeQuestionContainer.surveyQuestionInstance.canNavigateInternalNext());
		}

		return false;
	}

	/**
	 * Validates internal navigation previous
	 * @returns true if internal navigation previous
	 */
	private validateInternalNavigationPrevious(): boolean {
		if (this._activeQuestionContainer.surveyQuestionInstance != null) {
			return (this.navigateNextEnabled = this._activeQuestionContainer.surveyQuestionInstance.canNavigateInternalPrevious());
		}

		return false;
	}

	/**
	 * Validates the disabled / enabled state of the navigation buttons.
	 */
	public validateNavigation(): void {
		if (this._activeQuestionContainer === undefined) {
			return;
		}

		if (this.viewerState.activeQuestionIndex > 0) {
			this.navigatePreviousEnabled = true;
		} else {
			this.navigatePreviousEnabled = false;
		}

		if (this.navigationActiveState === false) {
			this.navigateNextEnabled = false;
		} else if (
			this.viewerState.activeQuestionIndex >= this.viewerState.surveyQuestions.length - 1 &&
			!this.validateInternalNavigationNext()
		) {
			this.navigateNextEnabled = false;
		} else if (this._activeQuestionContainer.responseValidationState === ResponseValidationState.INVALID) {
			this.navigateNextEnabled = false;
		} else {
			this.navigateNextEnabled = true;
		}

		// this.viewerState.activeQuestionIndex = this.questions[this.viewerState.activeQuestionIndex].pageIndex;
		this.viewerState.activeQuestion = this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex];
		this.headerDisplay.activePageIndex = this.viewerState.activeQuestion.pageIndex;
	}

	/**
	 *
	 */
	public ngAfterViewInit(): void {
		this.questionContainers.changes.subscribe((s) => {
			this._activeQuestionContainer = s.first;

			setTimeout(() => {
				this.callVisibilityHooks();
				this.validateNavigation();
			});
		});
	}

	public ngAfterContentInit(): void {}

	public ngAfterViewChecked(): void {}

	// public onQuestionScroll($event) {}
}
