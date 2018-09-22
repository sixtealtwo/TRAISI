import { Component, Inject, OnInit } from '@angular/core';
import { SurveyViewer, QuestionConfiguration, TRAISI } from 'traisi-question-sdk';
import { PartialObserver } from 'rxjs';
@Component({
	selector: 'traisi-number-question',
	template: require('./number-question.component.html').toString(),
	styles: [require('./number-question.component.scss').toString()]
})
export class NumberQuestionComponent extends TRAISI.SurveyQuestion<TRAISI.ResponseTypes.Decminal> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Number Question';


	typeName: string;
	icon: string;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'number';
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {}

	ngOnInit() {}
}
