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
	QuestionOption
} from 'traisi-question-sdk';
@Component({
	selector: 'traisi-checkbox-question',
	template: require('./checkbox-question.component.html').toString(),
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

	public modelChanged($event, option): void {
		console.log($event);
		console.log(option); 
	}

	private onLoadSavedResponse: (response: ResponseTypes.OptionSelect[] | 'none') => void = (
		response: ResponseTypes.OptionSelect[] | 'none'
	) => {
		if (response !== 'none') {
			this.model = response;
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

		options.forEach(option => {
			this.model[option.id] = false;
		});
	}
}
