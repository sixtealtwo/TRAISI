import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
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
	ResponseValidationState
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-radio-question',
	template: <string>require('./radio-question.component.html'),
	styles: [require('./radio-question.component.scss').toString()]
})
export class RadioQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect> implements OnInit, OnOptionsLoaded {
	public options: QuestionOption[];

	public selectedOption: any;

	/**
	 *
	 * @param _surveyViewerService
	 * @param _surveyResponderService
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer,
		@Inject('SurveyResponderService') private _surveyResponderService: SurveyResponder
	) {
		super();
		this.options = [];
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this._surveyViewerService.options.subscribe((value: QuestionOption[]) => {});

		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: ResponseData<ResponseTypes.OptionSelect>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.OptionSelect>[] | 'none'
	) => {
		if (response !== 'none') {
			let optionResponse = <StringResponseData>response[0];

			this.selectedOption = parseInt(optionResponse.value, 10);
			this.validationState.emit(ResponseValidationState.VALID);
		}
	};

	/**
	 * Determines whether model changed on
	 */
	public onModelChanged(): void {
		this.response.emit(this.selectedOption);
	}

	/**
	 *
	 * @param options
	 */
	public onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;
	}

	/**
	 * Traisis on init
	 */
	public traisiOnInit(): void {}
}
