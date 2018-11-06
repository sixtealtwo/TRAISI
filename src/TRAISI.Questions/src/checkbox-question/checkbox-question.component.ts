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
	OptionSelectResponseData
} from 'traisi-question-sdk';

@Component({
	selector: 'traisi-checkbox-question',
	template: require('./checkbox-question.component.html'),
	styles: [require('./checkbox-question.component.scss').toString()]
})
export class CheckboxQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect[]> implements OnInit, OnOptionsLoaded {
	public model: {};
	public options: QuestionOption[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();

		this.options = [];
		this.model = {};
		this.surveyViewerService.configurationData.subscribe(this.loadConfigurationData);
	}

	/**
	 *
	 * @param $event
	 * @param option
	 */
	public modelChanged($event, option): void {
		this.model[option.code] = $event.srcElement.checked;

		let responses: Array<OptionSelectResponseData> = Array<OptionSelectResponseData>();

		for (let key in this.model) {
			if (this.model[key] === true) {
				responses.push({
					value: key,
					name: key,
					code: key
				});
			}
		}

		this.response.emit(responses);
	}

	/**
	 * Determines whether load saved response on
	 */
	private onLoadSavedResponse: (responses: OptionSelectResponseData[] | 'none') => void = (
		responses: OptionSelectResponseData[] | 'none'
	) => {
		if (responses !== 'none') {
			responses.forEach((response) => {
				this.model[response.value] = true;
			});
		}
	};

	/**
	 * Loads configuration data once it is available.
	 * @param data
	 */
	public loadConfigurationData(data: QuestionConfiguration[]): void {
		this.data = data;
	}

	/** */
	public ngOnInit(): void {
		this.savedResponse.subscribe(this.onLoadSavedResponse);
	}

	/**
	 *
	 * @param options
	 */
	public onOptionsLoaded(options: QuestionOption[]): void {
		this.options = options;

		options.forEach((option) => {
			if (this.model[option['code']] === undefined) {
				this.model[option['code']] = false;
			}
		});
	}
}
