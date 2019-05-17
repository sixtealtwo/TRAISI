import { Component, OnInit } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes
} from 'traisi-question-sdk';
import templateString from './heading-question.component.html';
@Component({
	selector: 'traisi-heading-question',
	template: templateString,
	styles: [require('./heading-question.component.scss').toString()]
})
export class HeadingQuestionComponent extends SurveyQuestion<ResponseTypes.None> implements OnInit {


	public T: ResponseTypes.None;


	public constructor() {
		super();


	}

	public ngOnInit(): void {
		console.log('init');
	}

}
