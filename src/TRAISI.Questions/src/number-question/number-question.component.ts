import {Component, Inject, OnInit} from '@angular/core';
import { ISurveyViewerService, IQuestionConfiguration } from 'traisi-question-sdk';
import { PartialObserver } from '../../node_modules/rxjs';
@Component({
	selector: 'traisi-number-question',
	template: require('./number-question.component.html').toString(),
	styles: [require('./number-question.component.scss').toString()]
})
export class NumberQuestionComponent implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Number Question';

	typeName: string;
	icon: string;

    /**
	 * 
     * @param surveyViewerService
     */
	constructor(@Inject('ISurveyViewerService') private surveyViewerService: ISurveyViewerService) {
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'number';

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
