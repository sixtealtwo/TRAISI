import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { SurveyViewQuestionOption } from '../../models/survey-view-question-option.model';
import { OnOptionsLoaded, OnSurveyQuestionInit, SurveyResponder, TRAISI } from 'traisi-question-sdk';
import { SurveyResponderService } from '../../services/survey-responder.service';

@Component({
	selector: 'traisi-question-container',
	templateUrl: './question-container.component.html',
	styleUrls: ['./question-container.component.scss']
})
export class QuestionContainerComponent implements OnInit {
	@Input()
	question: any;

	@Input()
	surveyId: number;

	@ViewChild('questionTemplate', { read: ViewContainerRef })
	questionOutlet: ViewContainerRef;

	isLoaded: boolean = false;

	/**
	 *Creates an instance of QuestionContainerComponent.
	 * @param {QuestionLoaderService} questionLoaderService
	 * @param {SurveyViewerService} surveyViewerService
	 * @param {SurveyResponderService} responderService
	 * @param {ViewContainerRef} viewContainerRef
	 * @memberof QuestionContainerComponent
	 */
	constructor(
		private questionLoaderService: QuestionLoaderService,
		private surveyViewerService: SurveyViewerService,
		private responderService: SurveyResponderService,
		public viewContainerRef: ViewContainerRef
	) {}

	/**
	 *
	 */
	ngOnInit() {

		/**
		 * Load the question component into the specified question outlet.
		 */
		this.questionLoaderService
			.loadQuestionComponent(this.question.questionType, this.questionOutlet)
			.subscribe((componentRef: ComponentRef<any>) => {
				(<TRAISI.SurveyQuestion<any>>componentRef.instance).loadConfiguration(this.question.configuration);
				this.surveyViewerService
					.getQuestionOptions(this.surveyId, this.question.questionId, 'en', null)
					.subscribe((options: SurveyViewQuestionOption[]) => {
						this.isLoaded = true;

						if (componentRef.instance.__proto__.hasOwnProperty('onOptionsLoaded')) {
							(<OnOptionsLoaded>componentRef.instance).onOptionsLoaded(options);
						}

						if (componentRef.instance.__proto__.hasOwnProperty('onSurveyQuestionInit')) {
							(<OnSurveyQuestionInit>componentRef.instance).onSurveyQuestionInit(
								this.question.configuration
							);
						}

						this.responderService.registerQuestion(
							componentRef.instance,
							this.surveyId,
							this.question.questionId
						);
					});
			});
	}
}
