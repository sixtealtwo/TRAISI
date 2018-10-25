import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
	QuestionOption,
	ResponseData,
	DecimalResponseData,
	ResponseValidationState
} from 'traisi-question-sdk';
import { PartialObserver } from 'rxjs';
import { NumberQuestionConfiguration } from './number-question.configuration';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
	selector: 'traisi-number-question',
	template: require('./number-question.component.html').toString(),
	styles: [require('./number-question.component.scss').toString()]
})
export class NumberQuestionComponent extends SurveyQuestion<ResponseTypes.Decminal> implements OnInit {
	readonly QUESTION_TYPE_NAME: string = 'Number Question';

	typeName: string;
	icon: string;

	configuration: NumberQuestionConfiguration;

	public model: string;

	private _numberModel: number;

	public numberMask: any;

	@ViewChild('f')
	public inputForm: NgForm;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
		this.typeName = this.QUESTION_TYPE_NAME;
		this.icon = 'number';
	}

	/**
	 * Traisis on init
	 */
	public traisiOnInit() {}

	/**
	 * Models changed
	 */
	public modelChanged(): void {
		let number = Number(this.model.replace(/[^0-9\.]+/g, ''));

		this._numberModel = number;
		console.log(number);
	}

	/**
	 * Inputs blur
	 */
	public inputBlur(): void {
		const validated: boolean = this.validateInput();

		if (validated && this.inputForm.valid) {
			this.response.emit(this._numberModel);
		}

		console.log(this.inputForm);
	}

	/**
	 * Validates input
	 * @returns true if input
	 */
	private validateInput(): boolean {
		if (this.model === undefined || this.model.length === 0) {
			return false;
		}

		if (this._numberModel >= this.configuration.min && this._numberModel <= this.configuration.max) {
			return true;
		}

		return false;
	}

	/**
	 * on init
	 */
	public ngOnInit(): void {
		console.log(this.configuration);
		const format: any = JSON.parse(this.configuration.numberFormat);

		this.configuration.max = parseInt('' + this.configuration['max'], 10);
		this.configuration.min = parseInt('' + this.configuration['min'], 10);
		switch (format.id) {
			case 'Integer':
				this.numberMask = createNumberMask({
					prefix: '',
					suffix: '',
					allowDecimal: false
				});
				break;
			case 'Currency':
				this.numberMask = createNumberMask({
					prefix: '$ ',
					suffix: '',
					allowDecimal: true
				});
				break;
			case 'Decimal':
				this.numberMask = createNumberMask({
					prefix: '',
					suffix: '',
					allowDecimal: false
				});
				break;
		}
		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.Decminal>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.Decminal>[] | 'none'
	) => {
		if (response !== 'none') {
			let decimalResponse = <DecimalResponseData>response[0];
			this.model = '' + decimalResponse.value;
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};
}
