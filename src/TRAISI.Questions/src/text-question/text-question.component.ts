import {Component, OnInit, OnDestroy, Inject, EventEmitter} from '@angular/core';
import {
	OnVisibilityChanged,
	SurveyViewer,
	OnSurveyQuestionInit,
	QuestionConfiguration,
	SurveyQuestion,
	QuestionResponseState,
	TRAISI


} from 'traisi-question-sdk';


@Component({
	selector: 'traisi-text-question',
	template: require('./text-question.component.html').toString(),
	styles: [require('./text-question.component.scss').toString()]
})
export class TextQuestionComponent extends TRAISI.SurveyQuestion implements OnInit, OnVisibilityChanged, OnSurveyQuestionInit {


	onQuestionShown(): void {
		console.log('shown');
	}

	onQuestionHidden(): void {
		console.log('hidde');
	}

	readonly QUESTION_TYPE_NAME: string = 'Text Question';

	typeName: string;
	icon: string;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
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
