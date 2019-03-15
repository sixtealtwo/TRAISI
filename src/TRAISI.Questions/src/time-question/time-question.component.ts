import { Component, Inject, OnInit } from '@angular/core';
import { QuestionConfiguration, ResponseTypes, SurveyQuestion, SurveyResponder, SurveyViewer } from 'traisi-question-sdk';

@Component({
	selector: 'traisi-time-question',
	template: require('./time-question.component.html').toString(),
	styles: [require('./time-question.component.scss').toString()]
})
export class TimeQuestionComponent extends SurveyQuestion<ResponseTypes.Time> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Time Question';

	typeName: string;
	icon: string;

	public hours: number;

	public minutes: number;

	public am: boolean;

	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private surveyResponderService: SurveyResponder
	) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'time';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {
		console.log(data);
	}

	ngOnInit() {
		this.hours = 12;
		this.minutes = 0;
		this.am = true;
	}
}
