import {Component, OnInit} from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption
} from 'traisi-question-sdk';
@Component({
	selector: 'traisi-heading-question',
	template: <string>require('./heading-question.component.html'),
	styles: [require('./heading-question.component.scss').toString()]
})
export class HeadingQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {

	readonly QUESTION_TYPE_NAME: string = 'Heading';
	public T: ResponseTypes.None;
	typeName: string;
	icon: string;

	constructor() {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'heading';
		console.log('loaded');

	}

	ngOnInit() {
		console.log('init');
	}

}
