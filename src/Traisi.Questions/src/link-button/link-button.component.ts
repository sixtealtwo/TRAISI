import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	QuestionConfiguration,
	SurveyViewer,
	QuestionOption,
	ResponseValidationState,
	ResponseData,
	TraisiValues,
} from 'traisi-question-sdk';
import templateString from './link-button.component.html';
import styleString from './link-button.component.scss';
import { NgForm } from '@angular/forms';
import { debounceTime, skip } from 'rxjs/operators';
import { LinkButtonConfiguration } from './link-button.configuration';
@Component({
	selector: 'link-button',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class LinkButtonComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit {
	data: QuestionConfiguration[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(
		
	) {
		super();
	}

	public configLink: string = "";
	public configText: string = "";

	public ngOnInit(): void {

	}

	public model = {};

	// @ViewChild('matrixForm')
	// public form: NgForm;

	private onSavedResponseData: (response: ResponseData<ResponseTypes.Json>[] ) => void = (
		response: ResponseData<ResponseTypes.Json>[] 
	) => {

	};

	public onOptionsLoaded(options: QuestionOption[]): void {
		// this.options = options;
		for (let i of options) {
			if (i['name'] === 'Button Link') {
				this.configLink = i['label'];
			}else if (i['name'] === 'Button Text') {
				this.configText = i['label'];
			}
		}
	}

	/**
	 * @param {*} event
	 * @param {*} id
	 */
	
	public traisiOnInit(): void {
		this.validationState.emit(ResponseValidationState.VALID);
	}
}
