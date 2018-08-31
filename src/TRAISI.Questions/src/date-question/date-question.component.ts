import {Component, Inject, OnInit} from '@angular/core';
import {SurveyViewer, QuestionConfiguration, SurveyResponder} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-date-question',
	template: require('./date-question.component.html').toString(),
	styles: [require('./date-question.component.scss').toString()]
})
export class DateQuestionComponent implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Date Question';

	typeName: string;
	icon: string;

	constructor(@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
				@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'date';

		this._surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: QuestionConfiguration[]) {

	}

	ngOnInit() {
	}
}
