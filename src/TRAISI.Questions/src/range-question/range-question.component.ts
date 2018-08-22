import { Component, OnInit } from '@angular/core';
import { ISurveyViewerService, IQuestionConfiguration } from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
@Component({
	selector: 'traisi-range-question',
	template: require('./range-question.component.html').toString(),
	styles: [require('./range-question.component.scss').toString()]
})
export class RangeQuestionComponent implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Range Question';

	typeName: string;
	icon: string;
	constructor(private surveyViewerService: ISurveyViewerService) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'range';

		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	loadConfigurationData(data: IQuestionConfiguration[]){

	}

	ngOnInit() {
	}
}
