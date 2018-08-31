import {Component, Inject, OnInit} from '@angular/core';
import {SurveyViewer, QuestionOption, SurveyResponder, OnOptionsLoaded} from 'traisi-question-sdk';



@Component({
	selector: 'traisi-radio-question',
	template: <string>require('./radio-question.component.html'),
	styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent implements OnInit, OnOptionsLoaded {

	readonly QUESTION_TYPE_NAME: string = 'Radio Question';


	options: QuestionOption[];

	typeName: string;
	icon: string;
	selectdOption: any;

	constructor(@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
				@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder) {

		this.options = [];
	}


	ngOnInit() {


		this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {
			//this.questionOptions = value;
		});
	}

	/**
	 *
	 * @param options
	 */
	onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}
}
