import {Component, Inject, OnInit} from '@angular/core';
import {ISurveyViewerService, IQuestionOption} from "traisi-question-sdk";
//import { ISurveyViewerService, IQuestionConfiguration } from 'traisi-question-sdk';

@Component({
    selector: 'traisi-radio-question',
    template: <string>require('./radio-question.component.html'),
    styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent implements OnInit {
	
	readonly QUESTION_TYPE_NAME: string = 'Radio Question';

	
	questionOptions: IQuestionOption[];

	typeName: string;
	icon: string;
	constructor(@Inject('ISurveyViewerService') private _surveyViewerService: ISurveyViewerService) {

	    this.questionOptions = [];
	}

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 
	loadConfigurationData(data: IQuestionConfiguration[]){

		console.log(data);
	}*/

	ngOnInit() {
		console.log('init');
		
		this._surveyViewerService.options.subscribe((value: IQuestionOption[]) => {
		    this.questionOptions = value;
        });
	}
}
