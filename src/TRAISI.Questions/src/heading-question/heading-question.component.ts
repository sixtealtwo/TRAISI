import { Component, OnInit } from '@angular/core';
import { SurveyQuestion, ResponseTypes, ResponseValidationState } from 'traisi-question-sdk';
import templateString from './heading-question.component.html';
import styleString from './heading-question.component.scss';
@Component({
	selector: 'traisi-heading-question',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class HeadingQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {
	public constructor() {
		super();
	}

	public ngOnInit(): void {}

	public traisiOnInit(): void {
		this.validationState.emit(ResponseValidationState.VALID);
	}
}
