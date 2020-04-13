import {
	Component,
	ComponentRef,
	Input,
	OnInit,
	OnDestroy,
	ViewChild,
	ViewContainerRef,
	Inject,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	EventEmitter,
	Output,
	ViewEncapsulation,
	AfterViewChecked,
	AfterViewInit,
	AfterContentInit,
	ElementRef,
	Renderer2
} from '@angular/core';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewQuestionOption } from '../../models/survey-view-question-option.model';
import {
	OnOptionsLoaded,
	OnSurveyQuestionInit,
	SurveyResponder,
	SurveyQuestion,
	ResponseValidationState,
	ResponseTypes,
	ResponseData,
	QuestionConfigurationService
} from 'traisi-question-sdk';
import { SurveyResponderService } from '../../services/survey-responder.service';
import {
	SurveyViewQuestion as ISurveyQuestion,
	SurveyViewQuestion
} from '../../models/survey-view-question.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { SurveyViewerComponent } from '../survey-viewer/survey-viewer.component';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { Utilities } from 'shared/services/utilities';
import {
	animate,
	state,
	style,
	transition,
	trigger
} from '@angular/animations';
import { SurveyViewerState } from '../../models/survey-viewer-state.model';
import { SurveyNavigator } from 'app/modules/survey-navigation/services/survey-navigator/survey-navigator.service';
import { skip, share, distinct } from 'rxjs/operators';
import { QuestionInstance } from 'app/models/question-instance.model';
import { SurveyTextTransformer } from 'app/services/survey-text-transform/survey-text-transformer.service';

export { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export const fadeInOut = trigger('fadeInOut', [
	transition(':enter', [
		style({ opacity: 0 }),
		animate('0.4s ease-in', style({ opacity: 1 }))
	]),
	transition(':leave', [animate('0.4s 10ms ease-out', style({ opacity: 0 }))])
]);

@Component({
	selector: 'traisi-question-container',
	templateUrl: './question-container.component.html',
	styleUrls: ['./question-container.component.scss'],
	animations: [fadeInOut]
})
export class QuestionContainerComponent
	implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
	@Input()
	public question: ISurveyQuestion;

	@Input()
	public surveyId: number;

	@Input()
	public surveyViewer: SurveyViewerComponent;

	@Input()
	public surveyViewQuestion: SurveyViewQuestion;

	@Input()
	public respondent: SurveyViewGroupMember;

	@Input()
	public repeatNumber: number = 0;

	@Input()
	public sectionRepeatNumber: number = 0;

	@Input()
	public questionInstance: QuestionInstance;

	@Input()
	public activeQuestionIndex: number = 0;

	@Input()
	public questionTypeMap: { [id: number]: string };

	@Input()
	public questionNameMap: { [name: string]: number };

	@Input()
	public questionSectionElement: ElementRef;

	@ViewChild('questionTemplate', { read: ViewContainerRef, static: true })
	public questionOutlet: ViewContainerRef;

	private _responseSaved: Subject<boolean>;

	public titleLabel: BehaviorSubject<string>;

	private _questionInstance: SurveyQuestion<any>;

	public isLoaded: boolean = false;

	public validationStates: typeof ResponseValidationState = ResponseValidationState;

	public responseValidationState: ResponseValidationState;

	public displayClass: string = 'view-compact';

	get surveyQuestionInstance(): SurveyQuestion<any> {
		return this._questionInstance;
	}

	public get navIndex(): number {
		return this._viewerStateService.viewerState.questionNavIndex + 1;
	}

	public get viewerState(): SurveyViewerState {
		return this._viewerStateService.viewerState;
	}

	private alreadyNavigated: boolean = false;

	/**
	 * Creates an instance of question container component.
	 * @param questionLoaderService
	 * @param surveyViewerService
	 * @param _viewerStateService
	 * @param _responderService
	 * @param viewContainerRef
	 * @param _navigation
	 */
	constructor(
		@Inject('QuestionLoaderService')
		private questionLoaderService: QuestionLoaderService,
		@Inject('SurveyViewerService')
		private surveyViewerService: SurveyViewerService,
		private _viewerStateService: SurveyViewerStateService,
		@Inject('SurveyResponderService')
		private _responderService: SurveyResponderService,
		public viewContainerRef: ViewContainerRef,
		private _navigator: SurveyNavigator,
		private _elementRef: ElementRef,
		private renderer: Renderer2,
		private _questionConfigurationService: QuestionConfigurationService,
		private _textTransformer: SurveyTextTransformer
	) {}

	/**
	 * Calcs unique repeat number
	 * @returns unique repeat number
	 */
	private calcUniqueRepeatNumber(): number {
		return 0;
		// return this.repeatContainer.children.length * this.sectionRepeatNumber + this.repeatNumber;
	}

	/**
	 * Unregister question etc and unsubscribe certain subs
	 */
	public ngOnDestroy(): void {}

	public ngAfterContentInit(): void {
		// throw new Error("Method not implemented.");
	}
	public ngAfterViewInit(): void {
		// this.ngOnInit2();
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		/**
		 * Load the question component into the specified question outlet.
		 */
		this.responseValidationState = ResponseValidationState.PRISTINE;
		this.processPipedQuestionLabel(this.question.label);

		// this.container.questionInstance = this;

		this.questionLoaderService
			.loadQuestionComponent(this.question, this.questionOutlet)
			.subscribe(
				componentRef => {
					let surveyQuestionInstance: SurveyQuestion<any> = <
						SurveyQuestion<any>
					>componentRef.instance;
					let config = {
						...this._questionConfigurationService.getQuestionServerConfiguration(
							this.question.questionType
						),
						...this.question.configuration
					};
					surveyQuestionInstance.loadConfiguration(config);
					surveyQuestionInstance.questionId = this.question.questionId;
					surveyQuestionInstance.surveyId = this.surveyId;

					(<SurveyQuestion<any>>(
						componentRef.instance
					)).configuration = Object.assign(
						{},
						this.question.configuration
					);

					this.displayClass = (<SurveyQuestion<any>>(
						componentRef.instance
					)).displayClass;
					if (this.displayClass !== '') {
						this.renderer.addClass(
							this.questionSectionElement.nativeElement,
							this.displayClass
						);
					} else {
						// remove all of the classes
						this.renderer.setAttribute(
							this.questionSectionElement.nativeElement,
							'class',
							'question-section'
						);
					}

					this._responseSaved = new Subject<boolean>();

					this._responderService.registerQuestion(
						componentRef.instance,
						this.surveyId,
						this.question.questionId,
						this.respondent.id,
						this._responseSaved,
						this.surveyViewQuestion,
						this.calcUniqueRepeatNumber()
					);

					// this._viewerStateService.viewerState.activeQuestionContainers.push(this.container);

					this._responseSaved
						.pipe(share())
						.subscribe(this.onResponseSaved);

					this._responderService
						.getSavedResponse(
							this.surveyId,
							this.question.questionId,
							this.respondent.id,
							this.calcUniqueRepeatNumber()
						)
						.subscribe(response => {
							surveyQuestionInstance.savedResponse.next(
								response === undefined || response === null
									? 'none'
									: response.responseValues
							);

							surveyQuestionInstance.traisiOnLoaded();
						});

					surveyQuestionInstance.validationState.subscribe(
						this.onResponseValidationStateChanged
					);
					surveyQuestionInstance.autoAdvance.subscribe(
						(result: number) => {
							setTimeout(() => {
								this.autoAdvance();
							}, result);
						}
					);
					this._navigator.navigationState$.getValue().activeQuestionInstances[
						this.activeQuestionIndex
					].component = surveyQuestionInstance;

					surveyQuestionInstance.respondent = this.respondent;
					surveyQuestionInstance.traisiOnInit(
						this._viewerStateService.viewerState
							.isPreviousActionNext
					);
					// surveyQuestionInstance.serverConfiguration = questionConfiguration;
					this.surveyViewerService
						.getQuestionOptions(
							this.surveyId,
							this.question.questionId,
							'en',
							null
						)
						.subscribe((options: SurveyViewQuestionOption[]) => {
							this.isLoaded = true;

							this._questionInstance = componentRef.instance;
							if (
								componentRef.instance.__proto__.hasOwnProperty(
									'onOptionsLoaded'
								)
							) {
								(<OnOptionsLoaded>(
									componentRef.instance
								)).onOptionsLoaded(options);
							}
							(<ReplaySubject<any>>(
								(<unknown>(
									(<SurveyQuestion<any>>componentRef.instance)
										.questionOptions
								))
							)).next(options);
							if (
								componentRef.instance.__proto__.hasOwnProperty(
									'onSurveyQuestionInit'
								)
							) {
								(<OnSurveyQuestionInit>(
									componentRef.instance
								)).onSurveyQuestionInit(
									this.question.configuration
								);
							}
							(<ReplaySubject<any>>(
								(<unknown>(
									(<SurveyQuestion<any>>componentRef.instance)
										.configurations
								))
							)).next(this.question.configuration);
						});
					this._viewerStateService.viewerState.isNextEnabled = false;
					if (this.question.isOptional) {
						this._viewerStateService.viewerState.isNextEnabled = true;
					}
				},
				error => {},
				() => {}
			);
	}

	/**
	 * Autos advance
	 */
	private autoAdvance(): void {
		if (
			!this.alreadyNavigated &&
			!this._viewerStateService.viewerState.isNavComplete
		) {
			// this.navigation.navigateNext();
			this.alreadyNavigated = false;
		}
	}

	/**
	 * Retrieves household tag
	 * @returns household tag
	 */
	private retrieveHouseholdTag(): string {
		let questionId: number = +Object.keys(this.questionTypeMap).find(
			key => this.questionTypeMap[key] === 'household'
		);
		return Object.keys(this.questionNameMap).find(
			key => this.questionNameMap[key] === questionId
		);
	}

	/**
	 * Retrieves repeat number
	 * @returns repeat number
	 */
	private retrieveRepeatNumber(): number {
		if (
			this.surveyViewQuestion.parentSection.isRepeat &&
			!this.surveyViewQuestion.isRepeat
		) {
			return this.sectionRepeatNumber;
		} else {
			return this.repeatNumber;
		}
	}

	/**
	 * Process piped question label
	 * @param rawLabel
	 */
	private processPipedQuestionLabel(rawLabel: string): void {
		let processedLabel = Utilities.replacePlaceholder(
			rawLabel,
			this.retrieveHouseholdTag(),
			this.respondent.name
		);
		processedLabel = Utilities.replacePlaceholder(
			processedLabel,
			'respondentName',
			this.respondent.name
		);
		// get tag list
		let tags = Utilities.extractPlaceholders(processedLabel);
		processedLabel = this._textTransformer.transformText(processedLabel);

		if (tags && tags.length > 0) {
			let questionIdsForResponse = tags.map(
				tag => this.questionNameMap[tag]
			);

			questionIdsForResponse = questionIdsForResponse.filter(f => {
				return f !== undefined;
			});

			if (questionIdsForResponse.length > 0) {
				this._responderService
					.listResponsesForQuestions(
						questionIdsForResponse,
						this.respondent.id
					)
					.subscribe(responses => {
						tags.forEach((tag, index) => {
							if (
								this.questionNameMap[tag] ===
								this.question.repeatSource
							) {
								processedLabel = Utilities.replacePlaceholder(
									processedLabel,
									tag,
									`${this.repeatNumber + 1}`
								);
							} else if (
								this.question.parentSection &&
								this.question.parentSection.repeatSource ===
									this.questionNameMap[tag]
							) {
								processedLabel = Utilities.replacePlaceholder(
									processedLabel,
									tag,
									`${this.sectionRepeatNumber + 1}`
								);
							} else {
								processedLabel = Utilities.replacePlaceholder(
									processedLabel,
									tag,
									responses[index].responseValues[0].value
								);
							}
						});
						this.titleLabel = new BehaviorSubject(processedLabel);
					});
			}
		} else {
			this.titleLabel = new BehaviorSubject(processedLabel);
		}
	}

	/**
	 * Determines whether response validation state changed on
	 */
	private onResponseValidationStateChanged: (
		validationState: ResponseValidationState
	) => void = (validationState: ResponseValidationState): void => {
		this._viewerStateService.updateGroupQuestionValidationState(
			this.surveyViewQuestion,
			validationState
		);
		this.responseValidationState = validationState;
		if (this.surveyViewQuestion.respondentValidationState === undefined) {
			this.surveyViewQuestion.respondentValidationState = {};
		}
		this.surveyViewQuestion.respondentValidationState[
			this.respondent.id
		] = validationState;

		this._navigator.navigationState$.getValue().activeQuestionInstances[
			this.activeQuestionIndex
		].validationState = validationState;

		this._navigator.validationChanged();

	};

	/**
	 * Determines whether response saved on
	 */
	private onResponseSaved: (responseValid: boolean) => void = (
		responseValid: boolean
	): void => {
		// this._navigator.navigationState$.getValue().activeQuestionInstances[this.activeQuestionIndex].validationState
		// = this.responseValidationState;
		this._navigator.responseChanged();
	};

	/**
	 * Will unload is called before the active question is swapped out of view.
	 */
	public traisiQuestionWillUnload(): void {
		if (this._questionInstance !== undefined) {
			this._questionInstance.traisiOnUnloaded();
		}
	}
}
