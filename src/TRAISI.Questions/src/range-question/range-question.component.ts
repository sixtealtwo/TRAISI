import {Component, Inject, OnInit} from '@angular/core';
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
	selector: 'traisi-range-question',
	template: require('./range-question.component.html').toString(),
	styles: [require('./range-question.component.scss').toString()]
})
export class RangeQuestionComponent extends SurveyQuestion<ResponseTypes.Range> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Range Question';

	typeName: string;
	icon: string;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'range';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]){

	}

	ngOnInit() {
	}
}
