import { Component, ViewEncapsulation } from '@angular/core';
import { SurveyQuestion, ResponseTypes } from 'traisi-question-sdk';

import templateString from './route-select-question.component.html';
import styleString from './route-select-question.component.scss';
@Component({
	selector: 'traisi-route-select-question',
	template: '' + templateString,
	providers: [],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class RouteSelectQuestionComponent extends SurveyQuestion<ResponseTypes.Json> {}
