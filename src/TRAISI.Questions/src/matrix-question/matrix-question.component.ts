import { Component, OnInit } from '@angular/core';
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
	selector: 'traisi-matrix-question',
	template: require('./matrix-question.component.html').toString(),
	styles: [require('./matrix-question.component.scss').toString()]
})
export class MatrixQuestionComponent extends SurveyQuestion<ResponseTypes.Json>
	implements OnInit {
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
	loadConfigurationData(data: QuestionConfiguration[]) {
		console.log(data);
		this.data = data;
	}

	ngOnInit() {}
}
