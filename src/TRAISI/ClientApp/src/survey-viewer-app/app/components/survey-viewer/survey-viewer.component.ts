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
	HostListener,
	ElementRef
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
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';

import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { SurveyViewerTheme } from '../../models/survey-viewer-theme.model';
import { Header1Component } from '../special-page-builder/header1/header1.component';
import { Header2Component } from '../special-page-builder/header2/header2.component';
import { Footer1Component } from '../special-page-builder/footer1/footer1.component';
import { Utilities } from 'shared/services/utilities';

interface SpecialPageDataInput {
	pageHTML: string;
	pageThemeInfo: string;
}

@Component({
	selector: 'traisi-survey-viewer',
	templateUrl: './survey-viewer.component.html',
	styleUrls: ['./survey-viewer.component.scss'],
	animations: [
		trigger('visibleHidden', [
			/*transition('hidden => visible', [
				// query(':enter', style({ opacity: 0 }), { optional: true }),
				// query(':leave', style({ opacity: 1 }), { optional: true }),
				query(':self', stagger('1s', [animate('1s', keyframes([style({ opacity: 0 }), style({ opacity: 1 })]))]), {
					optional: true
				})
			]), */
			transition('* => hidden', [
				// query(':enter', style({ opacity: 0 }), { optional: true }),
				// query(':leave', style({ opacity: 1 }), { optional: true }),
				query(':self', stagger('1s', [animate('1s', keyframes([style({ opacity: 1 }), style({ opacity: 0, display: 'none' })]))]), {
					optional: true
				})
			])
		])
	]
})
export class SurveyViewerComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked {
	public questions: Array<SurveyViewQuestion>;

	public surveyId: number;

	public titleText: string;

	public loadedComponents: boolean = false;
	public headerComponent: any;
	public headerHTML: string;
	public headerInputs: SpecialPageDataInput;

	public footerComponent: any;
	public footerHTML: string;
	public footerInputs: SpecialPageDataInput;

	public navButtonClass: string;
	public pageTextColour: string;
	public questionTextColour: string;
	public useLightNavigationLines: boolean;

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

	public validationStates: typeof ResponseValidationState = ResponseValidationState;

	public get viewerState(): SurveyViewerState {
		return this._viewerStateService.viewerState;
	}

	public set viewerState(viewerState: SurveyViewerState) {
		this._viewerStateService.viewerState = viewerState;
	}

	public pageThemeInfo: any;
	public viewerTheme: SurveyViewerTheme;

	/**
	 * Creates an instance of survey viewer component.
	 * @param surveyViewerService
	 * @param _surveyResponderService
	 * @param _viewerStateService
	 * @param questionLoaderService
	 * @param route
	 * @param cdRef
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponderService,
		private _viewerStateService: SurveyViewerStateService,
		private questionLoaderService: QuestionLoaderService,
		private route: ActivatedRoute,
		private cdRef: ChangeDetectorRef,
		private elementRef: ElementRef
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
			activeGroupQuestions: [],
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

		this.surveyViewerService.pageThemeInfoJson.subscribe((pageTheme: any) => {
			this.pageThemeInfo = pageTheme;

			let theme: SurveyViewerTheme = {
				sectionBackgroundColour: null,
				questionViewerColour: null,
				viewerTemplate: null
			};

			theme.sectionBackgroundColour = pageTheme['householdHeaderColour'];
			theme.questionViewerColour = pageTheme['questionViewerColour'];
			theme.viewerTemplate = JSON.parse(pageTheme['viewerTemplate']);

			this.viewerTheme = theme;
			theme.viewerTemplate.forEach(sectionInfo => {
				if (sectionInfo.sectionType.startsWith('header')) {
					this.headerComponent = this.getComponent(sectionInfo.sectionType);
					this.headerHTML = sectionInfo.html;
				} else if (sectionInfo.sectionType.startsWith('footer')) {
					this.footerComponent = this.getComponent(sectionInfo.sectionType);
					this.footerHTML = sectionInfo.html;
				}
			});
			this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.pageThemeInfo.pageBackgroundColour;
			this.pageTextColour = this.getBestPageTextColour();
			this.questionTextColour = this.getBestQuestionBodyTextColor();
			this.navButtonClass = this.useDarkButtons() ? 'btn-inverse' : 'btn-default';
			this.useLightNavigationLines = this.pageTextColour === 'rgb(255,255,255)';
			this.setComponentInputs();
			this.loadedComponents = true;
		});
	}

	private getComponent(componentName: string): any {
		switch (componentName) {
			case 'header1':
				return Header1Component;
				break;
			case 'header2':
				return Header2Component;
				break;
			case 'footer1':
				return Footer1Component;
				break;
			default:
				return null;
				break;
		}
	}

	private setComponentInputs(): void {
		this.headerInputs = {
			pageHTML: this.headerHTML,
			pageThemeInfo: this.pageThemeInfo
		};

		this.footerInputs = {
			pageHTML: this.footerHTML,
			pageThemeInfo: this.pageThemeInfo
		};
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
				question.viewId = Symbol();
				this.questions.push(question);

				viewOrder++;
			});
			page.sections.forEach((section) => {
				section.questions.forEach((question) => {
					question.pageIndex = pageCount;
					question.viewOrder = viewOrder;
					question.parentSection = section;
					question.viewId = Symbol();
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
			this.viewerState.activeGroupQuestions = [];
		}
		this.viewerState.activePageIndex = this.viewerState.activeQuestion.pageIndex;
		this.updateRespondentGroup();

		// this._viewerStateService.updateState(this.viewerState);
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
					this.viewerState.groupMembers = group;
					this._viewerStateService.setActiveGroupQuestions(this.viewerState.activeQuestion, group);
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

		this._viewerStateService.updateState(this.viewerState);
	}

	/**
	 *
	 */
	public ngAfterViewInit(): void {
		this.questionContainers.changes.subscribe((s) => {
			this._activeQuestionContainer = s.first;

			if (s.length > 1) {
			}

			setTimeout(() => {
				this.callVisibilityHooks();
				this.validateNavigation();
			});
		});
	}

	public ngAfterContentInit(): void {}

	public ngAfterViewChecked(): void {}


	private useDarkButtons(): boolean {
		return this.pageTextColour !== 'rgb(0,0,0)';
	}

	private getBestPageTextColour(): string {
		if (this.pageThemeInfo.pageBackgroundColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.pageBackgroundColour);
		} else {
			return 'rgb(0,0,0)';
		}

	}
	private getBestQuestionBodyTextColor(): string {
		if (this.pageThemeInfo.questionViewerColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.questionViewerColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}

	// public onQuestionScroll($event) {}
}
