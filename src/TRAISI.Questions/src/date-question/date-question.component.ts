import { Component, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
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
	DateResponseData,
	ResponseData
} from 'traisi-question-sdk';
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DateQuestionConfiguration } from './date-question.configuration';

@Component({
	selector: 'traisi-date-question',
	template: require('./date-question.component.html').toString(),
	styles: [require('./date-question.component.scss').toString()]
})
export class DateQuestionComponent extends SurveyQuestion<ResponseTypes.Date> implements OnInit {
	@ViewChild('dateInput')
	public dateInput: BsDatepickerDirective;

	public dateData: Date;

	public bsConfig: Partial<BsDatepickerConfig>;

	public configuration: DateQuestionConfiguration;
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

		this.configuration = {
			minDate: undefined,
			maxDate: undefined
		};
	}

	public ngOnInit(): void {
		this.savedResponse.subscribe(this.onSavedResponseData);

		this.bsConfig = Object.assign(
			{},
			{
				containerClass: 'theme-default',
				dateInputFormat: 'MMMM DD YYYY'
			}
		);

		this.configuration.maxDate = new Date((<string>this.configuration.maxDate).replace(/"/g, ''));
		this.configuration.minDate = new Date((<string>this.configuration.minDate).replace(/"/g, ''));
	}

	/**
	 * Determines whether value change on
	 * @param value
	 */
	public onValueChange(value: Date): void {
		let data: DateResponseData = {
			value: value
		};

		if (value !== null) {
			this.response.emit(data);
		}
	}

	/**
	 * Determines whether saved response data on
	 */
	private onSavedResponseData: (response: DateResponseData[] | 'none') => void = (response: DateResponseData[] | 'none') => {
		if (response !== 'none') {
			let dateValue = new Date(response[0].value);

			this.dateData = dateValue;
		}
	};
}
