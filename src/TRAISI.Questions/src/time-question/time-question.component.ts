import { Component, Inject, OnInit } from '@angular/core';
import { QuestionConfiguration, ResponseTypes,
	SurveyQuestion, SurveyResponder, SurveyViewer, TimeResponseData } from 'traisi-question-sdk';
import { Time } from '@angular/common';

@Component({
	selector: 'traisi-time-question',
	template: require('./time-question.component.html').toString(),
	styles: [require('./time-question.component.scss').toString()]
})
export class TimeQuestionComponent extends SurveyQuestion<ResponseTypes.Time> implements OnInit {
	public readonly QUESTION_TYPE_NAME: string = 'Time Question';

	public typeName: string;
	public icon: string;

	public hours: number;

	public minutes: number;

	public am: boolean;

	public inputTime: Date;

	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private surveyResponderService: SurveyResponder
	) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'time';
		this.inputTime = new Date();
		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	public loadConfigurationData(data: QuestionConfiguration[]) {
		console.log(data);
	}

	public ngOnInit(): void {
		this.hours = 12;
		this.minutes = 0;
		this.am = true;
	}

	private onSavedResponseData: (response: TimeResponseData[] | 'none') => void = (response: TimeResponseData[] | 'none') => {
		if (response !== 'none') {
			let timeValue = new Date(response[0].value);
			this.inputTime = timeValue;
		}
	};
}
