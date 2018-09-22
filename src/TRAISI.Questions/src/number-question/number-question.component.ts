import { Component, Inject, OnInit } from '@angular/core';
import { SurveyViewer, QuestionConfiguration, TRAISI } from 'traisi-question-sdk';
import { PartialObserver } from 'rxjs';
import { NumberQuestionConfiguration } from './numer-question.configuration';
@Component({
	selector: 'traisi-number-question',
	template: require('./number-question.component.html').toString(),
	styles: [require('./number-question.component.scss').toString()]
})
export class NumberQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.Decminal> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Number Question';


	typeName: string;
	icon: string;

	configuration: NumberQuestionConfiguration;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'number';
	}


	ngOnInit() {

		console.log(this.configuration);
	}
}

 