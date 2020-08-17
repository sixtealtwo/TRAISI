import { Component, OnInit } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	QuestionConfiguration,
	SurveyViewer,
	QuestionOption,
	ResponseValidationState,
} from 'traisi-question-sdk';
import templateString from './matrix-question.component.html';
import styleString from './matrix-question.component.scss';
@Component({
	selector: 'traisi-matrix-question',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class MatrixQuestionComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit {
	data: QuestionConfiguration[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor() {
		super();
	}

	public rowLabels: string[] = [];
	public columnLabels: string[] = [];

	public ngOnInit(): void {}

	public model = {};

	public onOptionsLoaded(options: QuestionOption[]): void {
		// this.options = options;
		for (let i of options) {
			if (i['name'] === 'Row Options') {
				this.rowLabels.push(i['label']);
			} else {
				this.columnLabels.push(i['label']);
			}
		}
	}


	public changed(event,id): void {
		console.log(event);
    this.model[id] = true;
    console.log(this.model);
	}

	public traisiOnInit(): void {
		console.log(this);
		this.validationState.emit(ResponseValidationState.VALID);
	}
}
