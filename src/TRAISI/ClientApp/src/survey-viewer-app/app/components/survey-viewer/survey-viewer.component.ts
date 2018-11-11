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
import { ActivatedRoute, Params, Router } from '@angular/router';
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
import { SurveyUser } from 'shared/models/survey-user.model';
import { SurveyQuestionContainer } from '../../services/survey-viewer-navigation/survey-question-container';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';
import { SurveySectionContainer } from '../../services/survey-viewer-navigation/survey-section-container';
import { SurveyGroupContainer } from '../../services/survey-viewer-navigation/survey-group-container';
import { SurveyRepeatContainer } from '../../services/survey-viewer-navigation/survey-repeat-container';
import { SurveySectionRepeatContainer } from 'app/services/survey-viewer-navigation/survey-section-repeat-container';
import { SurveyPageContainer } from '../../services/survey-viewer-navigation/survey-page-container';
import { Title } from '@angular/platform-browser';

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
				query(
					':self',
					stagger('1s', [
						animate('1s', keyframes([style({ opacity: 1 }), style({ opacity: 0, display: 'none' })]))
					]),
					{
						optional: true
					}
				)
			])
		])
	],
	providers: []
})
export class SurveyViewerComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked {
	public questions: Array<SurveyViewQuestion>;
	public questionTypeMap: { [id: number]: string };
	public questionNameMap: { [name: string]: number };

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
	public sectionTitleColour: string;
	public useLightNavigationLines: boolean;

	@ViewChild(SurveyHeaderDisplayComponent)
	public headerDisplay: SurveyHeaderDisplayComponent;

	@ViewChildren('questions')
	public questionContainers!: QueryList<QuestionContainerComponent>;

	public activeQuestion: any;

	public isSection: boolean = false;

	public navigatePreviousEnabled: boolean = false;

	public navigateNextEnabled: boolean = false;

	private navigationActiveState: boolean = true;

	public isNextProcessing: boolean = false;

	public surveyName: string;

	private _activeQuestionContainer: QuestionContainerComponent;

	public ref: SurveyViewerComponent;

	public validationStates: typeof ResponseValidationState = ResponseValidationState;

	public get viewerState(): SurveyViewerState {
		return this._viewerStateService.viewerState;
	}

	public set viewerState(viewerState: SurveyViewerState) {
		this._viewerStateService.viewerState = viewerState;
	}

	public get isNavigationNextEnabled(): boolean {
		return this._navigation.isNavigationNextEnabled;
	}

	public get isNavigationPreviousEnabled(): boolean {
		return this._navigation.isNavigationPreviousEnabled;
	}

	public pageThemeInfo: any;
	public viewerTheme: SurveyViewerTheme;

	public isShowComplete: boolean = false;

	public currentUser: SurveyUser;

	/**
	 * Gets whether is admin
	 */
	public get isAdmin(): boolean {
		if (this.currentUser === undefined) {
			return false;
		} else {
			return this.currentUser.roles.includes('super administrator');
		}
	}

	/**
	 * Creates an instance of survey viewer component.
	 * @param surveyViewerService
	 * @param _surveyResponderService
	 * @param _viewerStateService
	 * @param _navigation
	 * @param route
	 * @param elementRef
	 */
	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponderService,
		private _viewerStateService: SurveyViewerStateService,
		private _navigation: SurveyViewerNavigationService,
		private route: ActivatedRoute,
		private _router: Router,
		private titleService: Title,
		private elementRef: ElementRef
	) {
		this.ref = this;
	}

	/**
	 * Initialization
	 */
	public ngOnInit(): void {
		this.currentUser = this.surveyViewerService.currentUser;

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
			this.sectionTitleColour = this.getBestSectionTitleColour();
			this.navButtonClass = this.useDarkButtons() ? 'btn-inverse' : 'btn-default';
			this.useLightNavigationLines = this.pageTextColour === 'rgb(255,255,255)';
			this.setComponentInputs();
			this.loadedComponents = true;
		});

		this._viewerStateService.surveyQuestionsChanged.subscribe((event: string) => {
			this.surveyQuestionsChanged();
		});

		this.route.parent.params.subscribe(params => {
			this.surveyName = params['surveyName'];
		});

		this.isShowComplete = false;
	}

	/**
	 *
	 */
	private surveyQuestionsChanged: () => void = () => {
		// update the validation based on new survey questions and active question
		// this.validateNavigation();
	};

	/**
	 * Gets component
	 * @param componentName
	 * @returns component
	 */
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
		this._surveyResponderService.getSurveyGroupMembers().subscribe((members: Array<SurveyViewGroupMember>) => {
			if (members.length > 0) {
				this.viewerState.groupMembers = [];
				members.forEach(member => {
					this.viewerState.groupMembers.push(member);
				});
				this.viewerState.primaryRespondent = members[0];
				this.viewerState.activeRespondent = members[0];
			} 


		this.questions = [];
		this.questionTypeMap = {};
		this.questionNameMap = {};
		let pageCount: number = 0;
		let viewOrder: number = 0;

		this.viewerState.surveyPages = pages;
		pages.forEach(page => {
			let pageContainer = new SurveyPageContainer(page);
			this.viewerState.viewContainers.push(pageContainer);
			page.questions.forEach(question => {
				question.pageIndex = pageCount;
				question.viewOrder = viewOrder;
				question.parentPage = page;
				question.viewId = Symbol();
				this.questionTypeMap[question.questionId] = question.questionType;
				this.questionNameMap[question.name] = question.questionId;
				this.questions.push(question);

				if (question.repeatTargets === undefined) {
					question.repeatTargets = [];
				}

				this.viewerState.questionMap[question.questionId] = question;

				if (question.isRepeat) {
					this.viewerState.questionMap[question.repeatSource].repeatTargets.push(question.questionId);
				}

				let sectionRepeatContainer = new SurveySectionRepeatContainer(null, this._viewerStateService);

				sectionRepeatContainer.order = question.order;

				let groupContainer = new SurveyGroupContainer(this._viewerStateService);

				let sectionContainer = new SurveySectionContainer(null, this._viewerStateService);

				let repeatContainer = new SurveyRepeatContainer(question, this._viewerStateService);

				let container = new SurveyQuestionContainer(question);

				repeatContainer.addQuestionContainer(container);

				groupContainer.repeatContainers.push(repeatContainer);

				sectionContainer.groupContainers.push(groupContainer);

				sectionRepeatContainer.children.push(sectionContainer);

				pageContainer.children.push(sectionRepeatContainer);
			});

			page.sections.forEach(section => {
				let inSectionIndex: number = 0;
				section.questions.forEach(question => {
					question.pageIndex = pageCount;
					question.viewOrder = viewOrder;
					question.parentSection = section;
					question.inSectionIndex = inSectionIndex;
					this.viewerState.questionMap[question.questionId] = question;
					question.viewId = Symbol();
					this.questionTypeMap[question.questionId] = question.questionType;
					this.questionNameMap[question.name] = question.questionId;
					this.questions.push(question);
					if (question.repeatTargets === undefined) {
						question.repeatTargets = [];
					}
					if (question.isRepeat) {
						this.viewerState.questionMap[question.repeatSource].repeatTargets.push(question.questionId);
					}
					inSectionIndex++;

					// try to find existing container
					let sectionContainer: SurveySectionContainer;

					let sectionRepeatContainer: SurveySectionRepeatContainer;

					let index = pageContainer.children.findIndex(container2 => {
						if (container2.sectionModel === null) {
							return false;
						}
						return container2.containerId === question.parentSection.id;
					});

					if (index < 0) {
						sectionRepeatContainer = new SurveySectionRepeatContainer(
							question.parentSection,
							this._viewerStateService
						);
						sectionRepeatContainer.order = section.order;
						sectionRepeatContainer.containerId = question.parentSection.id;
						sectionContainer = new SurveySectionContainer(question.parentSection, this._viewerStateService);
						
						sectionRepeatContainer.children.push(sectionContainer);
						pageContainer.children.push(sectionRepeatContainer);
					} else {
						sectionRepeatContainer = <SurveySectionRepeatContainer>pageContainer.children[index];
						sectionContainer = sectionRepeatContainer.children[0];
					}

					sectionContainer.groupContainers.forEach(groupContainer => {
						let repeatContainer = new SurveyRepeatContainer(question, this._viewerStateService);

						let container = new SurveyQuestionContainer(question);
						repeatContainer.addQuestionContainer(container);
	
						groupContainer.repeatContainers.push(repeatContainer);
					});
					sectionContainer.activeGroupContainer.initialize();


					
				
				});
			});
			pageContainer.children = sortBy(pageContainer.children, ['order']);
			pageCount += 1;
		});

		viewOrder = 0;
		this.viewerState.viewContainers.forEach(page => {
			page.children.forEach(sectionRepeat => {
				sectionRepeat.children.forEach(section => {
					section.children.forEach(group => {
						group.children.forEach(repeat => {
							repeat.children.forEach(question => {
								question.questionModel.viewOrder = viewOrder;
							});
						});
					});
				});
				viewOrder++;
			});
		});

		this.viewerState.activeQuestionIndex = 0;

		this.viewerState.surveyQuestionsFull = this.viewerState.surveyQuestions.concat([]);

		this.viewerState.activeQuestionIndex = 0;
		this.viewerState.activePageIndex = 0;

		
		this._navigation.navigationCompleted.subscribe(this.navigationCompleted);
		this._navigation.initialize();

		this.viewerState.isLoaded = true;
		this.viewerState.isQuestionLoaded = true;

		});
	}

	/**
	 *
	 * @param state
	 */
	private onNavigationStateChanged: (state: boolean) => void = (newState: boolean) => {};

	/**
	 * Evaluates whether a household question is currently active or not
	 */
	private isHouseholdQuestionActive(): boolean {
		return (
			this.viewerState.isSectionActive &&
			this.viewerState.activeQuestion.parentSection !== undefined &&
			this.viewerState.activeQuestion.parentSection.isHousehold
		);
	}

	public updateNavigation(): void {
		let conditionalResult = this._viewerStateService.evaluateConditionals(
			this.viewerState.activeQuestion.questionId,
			this.viewerState.isSectionActive && this.viewerState.activeQuestion.parentSection.isHousehold
				? this.viewerState.groupMembers[this.viewerState.activeGroupMemberIndex].id
				: this.viewerState.primaryRespondent.id
		);

		conditionalResult.subscribe((value: void) => {
			this._viewerStateService
				.evaluateRepeat(
					this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex],
					this.viewerState.isSectionActive && this.viewerState.activeQuestion.parentSection.isHousehold
						? this.viewerState.groupMembers[this.viewerState.activeGroupMemberIndex].id
						: this.viewerState.primaryRespondent.id
				)
				.subscribe((v: void) => {
					if (!this.validateInternalNavigationNext()) {
					}
				});
		});
	}

	public navigationCompleted = (navStatus: boolean) => {
		console.log(' navigation completed ');
	};

	public navigatePrevious(): void {
		this._navigation.navigatePrevious();
	}

	public navigateNext(): void {
		this._navigation.navigateNext();
	}

	/**
	 * Updates viewer state
	 */
	private updateViewerState(): void {
		if (this.viewerState.activeRepeatIndex <= 0 && !this.isHouseholdQuestionActive()) {
			this.viewerState.activeQuestion = this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex];
			if (!this.viewerState.activeQuestion.isRepeat) {
				this.viewerState.activeRepeatIndex = -1;
			}
			// this.viewerState.activeInSectionIndex = 0;
		} else if (
			this.viewerState.activeRepeatIndex > 0 &&
			this.viewerState.activeRepeatIndex <
				this.viewerState.activeQuestion.repeatChildren[this.activeRespondentId()].length
		) {
			this.viewerState.activeQuestion = this.viewerState.surveyQuestions[
				this.viewerState.activeQuestionIndex
			].repeatChildren[this.activeRespondentId()][this.viewerState.activeRepeatIndex - 1];
		} else if (
			!this.isHouseholdQuestionActive() &&
			this.viewerState.activeRepeatIndex >= 0 &&
			this.viewerState.activeRepeatIndex >
				this.viewerState.activeQuestion.repeatChildren[this.activeRespondentId()].length
		) {
			if (!this.isHouseholdQuestionActive()) {
				this.viewerState.activeRepeatIndex = -1;
				// this.viewerState.activeInSectionIndex = 0;
				this.viewerState.activeQuestion = this.viewerState.surveyQuestions[
					this.viewerState.activeQuestionIndex
				];
			} else {
				// console.log('resetting active repeat');
				// this.viewerState.activeRepeatIndex = -1;
				// this.viewerState.activeInSectionIndex = 0;
			}
		} else {
			this.viewerState.activeQuestionIndex = this.viewerState.activeQuestionIndex;
			this.viewerState.activeQuestion = this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex];
			this.viewerState.isSectionActive =
				this.viewerState.activeQuestion.parentSection === undefined ? false : true;
			if (this.isHouseholdQuestionActive()) {
				if (
					(this.viewerState.activeInSectionIndex >=
						this.countVisibleQuestionsInSection(this.viewerState.activeQuestion.parentSection) &&
						this.viewerState.activeGroupMemberIndex < this.viewerState.groupMembers.length - 1 &&
						!this.viewerState.activeQuestion.isRepeat) ||
					(this.viewerState.activeQuestion.isRepeat &&
						this.viewerState.activeInSectionIndex >=
							this.countVisibleQuestionsInSection(this.viewerState.activeQuestion.parentSection) &&
						this.viewerState.activeGroupMemberIndex < this.viewerState.groupMembers.length - 1 &&
						this.viewerState.activeRepeatIndex >
							this.viewerState.activeQuestion.repeatChildren[this.activeRespondentId()].length)
				) {
					this.viewerState.activeGroupMemberIndex++;
					this.viewerState.activeRepeatIndex = -1;
					this.viewerState.activeInSectionIndex = 0;
					this.viewerState.activeRespondent = this.viewerState.groupMembers[
						this.viewerState.activeGroupMemberIndex
					];

					const questionIndex = this.viewerState.surveyQuestions.findIndex(
						q => q === this.viewerState.activeSection.questions[0]
					);
					this.viewerState.activeQuestionIndex = questionIndex;
					this.viewerState.activeQuestion = this.viewerState.surveyQuestions[questionIndex];
				} else {
					// console.log(this.viewerState)
				}
			} else {
				this.viewerState.activeInSectionIndex = 0;
				this.viewerState.activeQuestion = this.viewerState.surveyQuestions[
					this.viewerState.activeQuestionIndex
				];
			}
		}

		if (!this.viewerState.activeQuestion.isRepeat) {
			// reset repeat index
			this.viewerState.activeRepeatIndex = -1;
		}

		if (this.viewerState.activeQuestion.isRepeat && this.viewerState.activeRepeatIndex < 0) {
			this.viewerState.activeRepeatIndex = 0;
		}

		if (
			this.viewerState.activeQuestion.parentSection !== undefined &&
			this.viewerState.activeGroupMemberIndex < 0
		) {
			this.viewerState.activeSection = this.viewerState.activeQuestion.parentSection;
			this.viewerState.isSectionActive = true;
			this.viewerState.activeGroupMemberIndex = 0;
			this.viewerState.activeRespondent = this.viewerState.groupMembers[0];
		} else if (this.viewerState.activeQuestion.parentSection === undefined) {
			this.viewerState.activeSection = null;
			this.viewerState.isSectionActive = false;
			this.viewerState.activeGroupMemberIndex = -1;

			this.viewerState.activeRespondent = this.viewerState.primaryRespondent;

			// clear the group members to prevent rendering
			// this.viewerState.groupMembers = [];
			this.viewerState.activeGroupQuestions = [];
		}

		this.viewerState.activePageIndex = this.viewerState.activeQuestion.pageIndex;

		this.viewerState.isQuestionLoaded = false;
		this.updateRespondentGroup();

		// this._viewerStateService.updateState(this.viewerState);
	}

	/**
	 * Counts visible questions in section
	 * @param section
	 * @returns visible questions in section
	 */
	private countVisibleQuestionsInSection(section: SurveyViewSection): number {
		let count: number = 0;
		section.questions.forEach(question => {
			const index: number = this.viewerState.surveyQuestions.findIndex(q => q.questionId === question.questionId);
			if (index >= 0) {
				count++;
			}
		});

		return count;
	}

	/**
	 * Shows group member
	 * @param memberIndex
	 */
	public showGroupMember(memberIndex: number): void {
		this._viewerStateService
			.evaluateRepeat(
				this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex],
				this.viewerState.isSectionActive && this.viewerState.activeQuestion.parentSection.isHousehold
					? this.viewerState.groupMembers[this.viewerState.activeGroupMemberIndex].id
					: this.viewerState.primaryRespondent.id
			)
			.subscribe((v: void) => {
				this.viewerState.activeGroupMemberIndex = memberIndex;
				this.viewerState.activeRespondent = this.viewerState.groupMembers[memberIndex];
			});
	}

	/**
	 *
	 */
	private callVisibilityHooks(): void {
		if (this._activeQuestionContainer !== undefined) {
			if (this._activeQuestionContainer.surveyQuestionInstance != null) {
				if (
					(<any>this._activeQuestionContainer.surveyQuestionInstance).__proto__.hasOwnProperty(
						'onQuestionShown'
					)
				) {
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
					this.viewerState.activeRespondent =
						group[
							this.viewerState.activeGroupMemberIndex >= 0 ? this.viewerState.activeGroupMemberIndex : 0
						];
					this.viewerState.isQuestionLoaded = true;
					// this._viewerStateService.setActiveGroupQuestions(this.viewerState.activeQuestion, group);
				});
			}
		} else {
			this.viewerState.isQuestionLoaded = true;
		}
	}

	/**
	 * Validates internal navigation next
	 * @returns true if internal navigation next
	 */
	private validateInternalNavigationNext(): boolean {
		if (this._activeQuestionContainer.surveyQuestionInstance != null) {
			// console.log('navigate: ' + this._activeQuestionContainer.surveyQuestionInstance.canNavigateInternalNext());
			return this._activeQuestionContainer.surveyQuestionInstance.canNavigateInternalNext();
		}

		return false;
	}

	/**
	 * Determines whether active question multi page is
	 * @returns true if active question multi page
	 */
	private isActiveQuestionMultiPage(): boolean {
		if (this._activeQuestionContainer.surveyQuestionInstance != null) {
			return this._activeQuestionContainer.surveyQuestionInstance.isMultiPage;
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
		return;
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
			this.isShowComplete = true;
		} else if (this._activeQuestionContainer.responseValidationState === ResponseValidationState.INVALID) {
			this.navigateNextEnabled = false;
		} else if (!this.isHouseholdQuestionActive()) {
			this.navigateNextEnabled = true;
		}

		// check current repeat
		if (this.viewerState.activeQuestion !== undefined && this.viewerState.activeQuestion.isRepeat) {
			if (
				this.viewerState.activeRepeatIndex <
				this.viewerState.activeQuestion.repeatChildren[this.activeRespondentId()].length
			) {
				this.navigateNextEnabled = true;
			}
		}

		if (this.isHouseholdQuestionActive()) {
			if (this.viewerState.activeGroupMemberIndex < this.viewerState.groupMembers.length - 1) {
				this.navigateNextEnabled = true;
			} else if (this.viewerState.activeGroupMemberIndex === this.viewerState.groupMembers.length - 1) {
				if (
					this.viewerState.activeInSectionIndex <
					this.countVisibleQuestionsInSection(this.viewerState.activeQuestion.parentSection) - 1
				) {
					this.navigateNextEnabled = true;
				}
			}
		}

		if (this.isActiveQuestionMultiPage() && !this.validateInternalNavigationNext()) {
			this.navigateNextEnabled = false;
		}

		// this.viewerState.activeQuestionIndex = this.questions[this.viewerState.activeQuestionIndex].pageIndex;
		this.viewerState.activeQuestion = this.viewerState.surveyQuestions[this.viewerState.activeQuestionIndex];

		this.headerDisplay.activePageIndex = this.viewerState.activeQuestion.pageIndex;

		if (!this.viewerState.activeQuestion.isRepeat && this.viewerState.activeRepeatIndex >= 0) {
			this.viewerState.activeRepeatIndex = -1;
		}

		if (
			this.navigateNextEnabled === true ||
			this._activeQuestionContainer.responseValidationState === ResponseValidationState.INVALID
		) {
			this.isShowComplete = false;
		}

		// this.navigateNextEnabled = true;
	}

	private activeRespondentId(): number {
		if (this.isHouseholdQuestionActive()) {
			return this.viewerState.groupMembers[this.viewerState.activeGroupMemberIndex].id;
		} else {
			return this.viewerState.primaryRespondent.id;
		}
	}

	private retrieveHouseholdTag(): string {
		let questionId: number = +Object.keys(this.questionTypeMap).find(
			key => this.questionTypeMap[key] === 'household'
		);
		return Object.keys(this.questionNameMap).find(key => this.questionNameMap[key] === questionId);
	}

	public processedSectionLabel(sectionTitle: string): string {
		return Utilities.replacePlaceholder(
			sectionTitle,
			this.retrieveHouseholdTag(),
			this.viewerState.activeRespondent.name
		);
	}

	/**
	 *
	 */
	public ngAfterViewInit(): void {
		this.questionContainers.changes.subscribe(s => {
			this._activeQuestionContainer = s.first;

			if (s.length > 1) {
			}

			setTimeout(() => {
				this.callVisibilityHooks();
				this.validateNavigation();
			});
		});
	}

	/**
	 * Navigates complete survey
	 */
	public navigateCompleteSurvey(): void {
		console.log('navigate to thankyou page ');

		this._router.navigate([this.surveyName, 'thankyou']);
	}

	public ngAfterContentInit(): void {}

	public ngAfterViewChecked(): void {}

	/**
	 * Uses dark buttons
	 * @returns true if dark buttons
	 */
	private useDarkButtons(): boolean {
		return this.pageTextColour !== 'rgb(0,0,0)';
	}

	/**
	 * Gets best page text colour
	 * @returns best page text colour
	 */
	private getBestPageTextColour(): string {
		if (this.pageThemeInfo.pageBackgroundColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.pageBackgroundColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}

	private getBestSectionTitleColour(): string {
		if (this.pageThemeInfo.pageBackgroundColour) {
			return Utilities.whiteOrBlackText(this.viewerTheme.sectionBackgroundColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}

	/**
	 * Gets best question body text color
	 * @returns best question body text color
	 */
	private getBestQuestionBodyTextColor(): string {
		if (this.pageThemeInfo.questionViewerColour) {
			return Utilities.whiteOrBlackText(this.pageThemeInfo.questionViewerColour);
		} else {
			return 'rgb(0,0,0)';
		}
	}

	// public onQuestionScroll($event) {}
}
