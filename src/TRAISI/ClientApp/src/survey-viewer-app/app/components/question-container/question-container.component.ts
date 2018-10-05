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
	ChangeDetectorRef
} from '@angular/core';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewQuestionOption } from '../../models/survey-view-question-option.model';
import { OnOptionsLoaded, OnSurveyQuestionInit, SurveyResponder, SurveyQuestion, ResponseValidationState } from 'traisi-question-sdk';
import { SurveyResponderService } from '../../services/survey-responder.service';
import { SurveyQuestion as ISurveyQuestion } from 'app/models/survey-question.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

export { IconDefinition } from '@fortawesome/free-solid-svg-icons';
@Component({
	selector: 'traisi-question-container',
	templateUrl: './question-container.component.html',
	styleUrls: ['./question-container.component.scss']
})
export class QuestionContainerComponent implements OnInit, OnDestroy {

	@Input()
	question: ISurveyQuestion;

	@Input()
	surveyId: number;

	@Input()
	questionIndex: number;

	@ViewChild('questionTemplate', { read: ViewContainerRef })
	questionOutlet: ViewContainerRef;

	public titleLabel: BehaviorSubject<string>;

	private _questionInstance: SurveyQuestion<any>;

	get surveyQuestionInstance(): SurveyQuestion<any> {
		return this._questionInstance;
	}

	isLoaded: boolean = false;

	public validationStates = ResponseValidationState;

	public responseValidationState: ResponseValidationState;

	/**
	 *Creates an instance of QuestionContainerComponent.
	 * @param {QuestionLoaderService} questionLoaderService
	 * @param {SurveyViewerService} surveyViewerService
	 * @param {SurveyResponderService} responderService
	 * @param {ViewContainerRef} viewContainerRef
	 * @memberof QuestionContainerComponent
	 */
	constructor(
		@Inject('QuestionLoaderService') private questionLoaderService: QuestionLoaderService,
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		private cdRef: ChangeDetectorRef,
		private responderService: SurveyResponderService,
		public viewContainerRef: ViewContainerRef
	) {}

	/**
	 * Unregister question etc and unsubscribe certain subs
	 */
	ngOnDestroy(): void {

	}

	/**
	 *
	 */
	ngOnInit() {
		/**
		 * Load the question component into the specified question outlet.
		 */

		this.responseValidationState = ResponseValidationState.PRISTINE;

		this.titleLabel = new BehaviorSubject(this.question.label);

		this.questionLoaderService
			.loadQuestionComponent(this.question, this.questionOutlet)
			.subscribe((componentRef: ComponentRef<any>) => {
				let surveyQuestionInstance = <SurveyQuestion<any>>componentRef.instance;

				surveyQuestionInstance.loadConfiguration(this.question.configuration);

				// call traisiOnInit to notify of initialization finishing
				surveyQuestionInstance.questionId = this.question.questionId;

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
							(<OnSurveyQuestionInit>componentRef.instance).onSurveyQuestionInit(this.question.configuration);
						}

						this.responderService.registerQuestion(componentRef.instance, this.surveyId, this.question.questionId);

						this.responderService.getSavedResponse(this.surveyId, this.question.questionId).subscribe(response => {
							surveyQuestionInstance.savedResponse.next(response == null ? 'none' : response.responseValue);

							surveyQuestionInstance.traisiOnLoaded();
						});

						surveyQuestionInstance.validationState.subscribe(this.onResponseValidationStateChanged);
					});
			});
	}

	/**
	 * Callback for when the response's validation state changes
	 */
	private onResponseValidationStateChanged: (state: ResponseValidationState) => void = (validationState: ResponseValidationState) => {
		this.responseValidationState = validationState;
	};
}
