import { Component, OnInit } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	ResponseValidationState
} from 'traisi-question-sdk';
import templateString from './heading-question.component.html';
@Component({
	selector: 'traisi-heading-question',
	template: templateString,
	styles: [require('./heading-question.component.scss').toString()]
})
export class HeadingQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {

	public constructor() {
		super();
	}

	public ngOnInit(): void {
	}

	public traisiOnInit(): void {
		this.validationState.emit(ResponseValidationState.VALID);
	}

}
