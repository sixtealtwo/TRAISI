import { Component, OnInit } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption
} from 'traisi-question-sdk';
import templateString from './matrix-question.component.html';
@Component({
	selector: 'traisi-matrix-question',
	template: templateString,
	styles: [require('./matrix-question.component.scss').toString()]
})
export class MatrixQuestionComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Matrix Question';

	data: QuestionConfiguration[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(private surveyViewerService: SurveyViewer) {
		super();

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {
		console.log(data);
		this.data = data;
	}

	ngOnInit() {}
}
