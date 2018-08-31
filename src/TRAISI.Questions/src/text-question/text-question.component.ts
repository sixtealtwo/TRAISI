import {Component, OnInit, OnDestroy, Inject, EventEmitter} from '@angular/core';
import {OnVisibilityChanged, SurveyViewer, OnSurveyQuestionInit, SurveyQuestion, QuestionConfiguration} from 'traisi-question-sdk';


@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent implements OnInit, OnVisibilityChanged, OnSurveyQuestionInit {
	
	
	onQuestionShown(): void {
		console.log('shown');
	}

	onQuestionHidden(): void {
		console.log('hidde');
	}

	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	response: EventEmitter<any>;

	typeName: string;
	icon: string;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'text';

	}

	ngOnInit() {
		this.onQuestionShown();
	}

	/**
	 *
	 * @param configuration
	 */
	onSurveyQuestionInit(configuration: QuestionConfiguration[]): void {

	}
}
