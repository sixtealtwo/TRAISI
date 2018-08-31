import {Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {QuestionLoaderService} from '../../services/question-loader.service';
import {NgTemplateOutlet} from '@angular/common';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {SurveyViewQuestionOption} from '../../models/survey-view-question-option.model';
import {OnOptionsLoaded} from 'traisi-question-sdk';

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


	@ViewChild('questionTemplate', {read: ViewContainerRef}) questionOutlet: ViewContainerRef;


	isLoaded: boolean = false;

	constructor(private questionLoaderService: QuestionLoaderService,
				private surveyViewerService: SurveyViewerService,
				public viewContainerRef: ViewContainerRef) {
	}

	/**
	 *
	 */
	ngOnInit() {



		this.questionLoaderService.loadQuestionComponent(this.question.questionType, this.questionOutlet)
			.subscribe((componentRef: ComponentRef<any>) => {


				this.surveyViewerService.getQuestionOptions(this.surveyId, this.question.questionId, 'en', null).subscribe((options: SurveyViewQuestionOption[]) => {
					this.isLoaded = true;

					if (componentRef.instance.__proto__.hasOwnProperty('onOptionsLoaded')) {

						(<OnOptionsLoaded>componentRef.instance).onOptionsLoaded(options);
					}


				});
			});

	}

}
