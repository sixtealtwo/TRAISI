import { Component, OnInit } from '@angular/core';
import {SurveyViewer, QuestionConfiguration, TRAISI} from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
@Component({
	selector: 'traisi-matrix-question',
	template: require('./matrix-question.component.html').toString(),
	styles: [require('./matrix-question.component.scss').toString()]
})
export class MatrixQuestionComponent extends TRAISI.SurveyQuestion implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Matrix Question';

	typeName: string;
	icon: string;

	data: QuestionConfiguration[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'matrix';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]){

		console.log(data);
		this.data = data;
	}

	ngOnInit() {
	}
}
