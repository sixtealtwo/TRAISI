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
	Output
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
	ResponseData
} from 'traisi-question-sdk';
import { SurveyResponderService } from '../../services/survey-responder.service';
import { SurveyViewQuestion as ISurveyQuestion, SurveyViewQuestion } from '../../models/survey-view-question.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject, Subject } from 'rxjs';
import { SurveyViewerComponent } from '../survey-viewer/survey-viewer.component';
import { SurveyViewGroupMember } from '../../models/survey-view-group-member.model';
import { SurveyViewerStateService } from '../../services/survey-viewer-state.service';
import { Utilities } from 'shared/services/utilities';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SurveyRepeatContainer } from '../../services/survey-viewer-navigation/survey-repeat-container';
import { SurveyQuestionContainer } from '../../services/survey-viewer-navigation/survey-question-container';
import { SurveyViewerNavigationService } from '../../services/survey-viewer-navigation/survey-viewer-navigation.service';

export { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export const fadeInOut = trigger('fadeInOut', [
	transition(':enter', [style({ opacity: 0 }), animate('0.4s ease-in', style({ opacity: 1 }))]),
	transition(':leave', [animate('0.4s 10ms ease-out', style({ opacity: 0 }))])
]);

@Component({
	selector: 'traisi-question-container',
	templateUrl: './question-container.component.html',
	styleUrls: ['./question-container.component.scss'],
	animations: [fadeInOut]
})
export class QuestionContainerComponent implements OnInit, OnDestroy {
	@Input()
	public question: ISurveyQuestion;

	@Input()
	public surveyId: number;

	@Input()
	public surveyViewer: SurveyViewerComponent;

	@Input()
	public container: SurveyQuestionContainer;

	@Input()
	public surveyViewQuestion: SurveyViewQuestion;

	@Input()
	public respondent: SurveyViewGroupMember;

	@Input()
	public repeatNumber: number;

	@Input()
	public questionTypeMap: { [id: number]: string };

	@Input()
	public questionNameMap: { [name: string]: number };

	@ViewChild('questionTemplate', { read: ViewContainerRef })
	public questionOutlet: ViewContainerRef;

	private _responseSaved: Subject<boolean>;

	public titleLabel: BehaviorSubject<string>;

	private _questionInstance: SurveyQuestion<any>;

	get surveyQuestionInstance(): SurveyQuestion<any> {
		return this._questionInstance;
	}

	public isLoaded: boolean = false;

	public validationStates: typeof ResponseValidationState = ResponseValidationState;

	public responseValidationState: ResponseValidationState;

	public displayClass: string = 'view-compact';

	public get navigation(): SurveyViewerNavigationService {
		return this._navigation;
	}

	private alreadyNavigated: boolean = false;

	/**
	 * Creates an instance of question container component.
	 * @param questionLoaderService
	 * @param surveyViewerService
	 * @param _viewerStateService
	 * @param cdRef
	 * @param responderService
	 * @param viewContainerRef
	 */
	constructor(
		@Inject('QuestionLoaderService') private questionLoaderService: QuestionLoaderService,
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		private _viewerStateService: SurveyViewerStateService,
		private cdRef: ChangeDetectorRef,
		@Inject('SurveyResponderService') private _responderService: SurveyResponderService,
		public viewContainerRef: ViewContainerRef,
		private _navigation: SurveyViewerNavigationService
	) {}

	/**
	 * Unregister question etc and unsubscribe certain subs
	 */
	public ngOnDestroy(): void {}

	/**
	 *
	 */
	public ngOnInit(): void {
		/**
		 * Load the question component into the specified question outlet.
		 */

		this.responseValidationState = ResponseValidationState.PRISTINE;
		this.processPipedQuestionLabel(this.question.label);
		this.container.questionInstance = this;
		this.questionLoaderService
			.loadQuestionComponent(this.question, this.questionOutlet)
			.subscribe((componentRef: ComponentRef<any>) => {
				let surveyQuestionInstance = <SurveyQuestion<any>>componentRef.instance;

				surveyQuestionInstance.loadConfiguration(this.question.configuration);

				// call traisiOnInit to notify of initialization finishing
				surveyQuestionInstance.questionId = this.question.questionId;

				surveyQuestionInstance.surveyId = this.surveyId;

				(<SurveyQuestion<any>>componentRef.instance).configuration = Object.assign(
					{},
					this.question.configuration
				);

				this.displayClass = (<SurveyQuestion<any>>componentRef.instance).displayClass;
				this._responseSaved = new Subject<boolean>();

				this._responderService.registerQuestion(
					componentRef.instance,
					this.surveyId,
					this.question.questionId,
					this.respondent.id,
					this._responseSaved,
					this.surveyViewQuestion
				);

				this._responseSaved.subscribe(this.onResponseSaved);

				this._responderService
					.getSavedResponse(this.surveyId, this.question.questionId, this.respondent.id, this.repeatNumber)
					.subscribe(response => {
						surveyQuestionInstance.savedResponse.next(
							response === undefined || response === null ? 'none' : response.responseValues
						);

						surveyQuestionInstance.traisiOnLoaded();
					});

				surveyQuestionInstance.validationState.subscribe(this.onResponseValidationStateChanged);
				surveyQuestionInstance.autoAdvance.subscribe((result: number) => {
					setTimeout(() => {
						this.autoAdvance();
					}, result);
				});

				surveyQuestionInstance.respondent = this.respondent;
				surveyQuestionInstance.traisiOnInit();
				this.surveyViewerService
					.getQuestionOptions(this.surveyId, this.question.questionId, 'en', null)
					.subscribe((options: SurveyViewQuestionOption[]) => {
						this.isLoaded = true;

						this._questionInstance = componentRef.instance;
						if (componentRef.instance.__proto__.hasOwnProperty('onOptionsLoaded')) {
							(<OnOptionsLoaded>componentRef.instance).onOptionsLoaded(options);
						}

						if (componentRef.instance.__proto__.hasOwnProperty('onSurveyQuestionInit')) {
							(<OnSurveyQuestionInit>componentRef.instance).onSurveyQuestionInit(
								this.question.configuration
							);
						}
				
						this._navigation.navigationCompleted.next(true);
						this._navigation.navigationCompleted.subscribe(result =>  {
							this.alreadyNavigated = true;
						});
					});
			});
	}

	private autoAdvance(): void {
		if (!this.alreadyNavigated) {
			this.navigation.navigateNext();
			this.alreadyNavigated = false;
		}
	}

	private retrieveHouseholdTag(): string {
		let questionId: number = +Object.keys(this.questionTypeMap).find(
			key => this.questionTypeMap[key] === 'household'
		);
		return Object.keys(this.questionNameMap).find(key => this.questionNameMap[key] === questionId);
	}

	private processPipedQuestionLabel(rawLabel: string): void {
		let processedLabel = Utilities.replacePlaceholder(rawLabel, this.retrieveHouseholdTag(), this.respondent.name);

		// get tag list
		let tags = Utilities.extractPlaceholders(processedLabel);
		if (tags && tags.length > 0) {
			let questionIdsForResponse = tags.map(tag => this.questionNameMap[tag]);

			this._responderService
				.listResponsesForQuestions(questionIdsForResponse, this.respondent.id)
				.subscribe(responses => {
					tags.forEach((tag, index) => {
						processedLabel = Utilities.replacePlaceholder(
							processedLabel,
							tag,
							responses[index].responseValues[0].value
						);
					});
					this.titleLabel = new BehaviorSubject(processedLabel);
				});
		} else {
			this.titleLabel = new BehaviorSubject(processedLabel);
		}
	}

	/**
	 * Determines whether response validation state changed on
	 */
	private onResponseValidationStateChanged: (validationState: ResponseValidationState) => void = (
		validationState: ResponseValidationState
	): void => {
		this._viewerStateService.updateGroupQuestionValidationState(this.surveyViewQuestion, validationState);
		this.responseValidationState = validationState;
		if (this.surveyViewQuestion.respondentValidationState === undefined) {
			this.surveyViewQuestion.respondentValidationState = {};
		}
		this.surveyViewQuestion.respondentValidationState[this.respondent.id] = validationState;
		this._navigation.updateState();
		// this.surveyViewer.validateNavigation();
	};

	/**
	 * Determines whether response saved on
	 */
	private onResponseSaved: (responseValid: boolean) => void = (responseValid: boolean): void => {
		if (responseValid) {
			// this._viewerStateService.evaluateConditionals(this.question.questionId, this.respondent.id);
			// this._viewerStateService.evaluateRepeat(this._viewerStateService.viewerState.activeQuestion, this.respondent.id);
			// this.surveyViewer.updateNavigation();
		}
	};
}
