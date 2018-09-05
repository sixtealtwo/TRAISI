import { Component, OnInit } from '@angular/core';
import {SurveyViewer, QuestionConfiguration, TRAISI} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-likert-question',
	template: require('./likert-question.component.html').toString(),
	styles: [require('./likert-question.component.scss').toString()]
})
export class LikertQuestionComponent extends TRAISI.SurveyQuestion implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Likert Question';


	typeName: string;
	icon: string;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'likert';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]){
		
		this.data = data;
	}

	ngOnInit() {
	}
}
