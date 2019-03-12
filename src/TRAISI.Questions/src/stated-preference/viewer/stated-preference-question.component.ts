import { Component, Inject, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import {
	OnOptionsLoaded,
	OnSaveResponseStatus,
	OnVisibilityChanged,
	QuestionOption,
	ResponseTypes,
	SurveyQuestion,
	SurveyViewer
} from 'traisi-question-sdk';
import { StatedPreferenceConfig } from '../stated-preference-config.model';

/**
 * Base question component definition for the question type "Stated Preference"
 *
 * @export
 * @class StatedPreferenceQuestionComponent
 * @extends {SurveyQuestion<ResponseTypes.String>}
 * @implements {OnInit}
 * @implements {OnVisibilityChanged}
 * @implements {OnSaveResponseStatus}
 */
@Component({
	selector: 'traisi-stated-preference-question',
	template: require('./stated-preference-question.component.html'),
	styles: [require('./stated-preference-question.component.scss')]
})
export class StatedPreferenceQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect[]>
	implements OnInit, OnVisibilityChanged, OnSaveResponseStatus {
	public options: QuestionOption[];
	public model: ReplaySubject<StatedPreferenceConfig>;
	public hasError: boolean = false;

	/**
	 *Creates an instance of StatedPreferenceQuestionComponent.
	 * @param {SurveyViewer} _surveyViewerService
	 * @memberof StatedPreferenceQuestionComponent
	 */
	constructor(@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer) {
		super();
		this.model = new ReplaySubject<StatedPreferenceConfig>();
	}

	public onQuestionShown(): void {}
	public onQuestionHidden(): void {}
	public onResponseSaved(result: any): void {}

	/**
	 * @private
	 * @param {QuestionOption} value
	 * @memberof StatedPreferenceQuestionComponent
	 */
	private parseSpModel(value: any): void {
		try {
			this.model.next(JSON.parse(value.value));
		} catch (exception) {
			console.error(exception);
			this.hasError = true;
		}
	}

	/**
	 * @memberof StatedPreferenceQuestionComponent
	 */
	public ngOnInit(): void {
		this.questionOptions.subscribe(options => {
			if (options.length > 0) {
				this.parseSpModel(options[0]);
			}
		});
	}

	/**
	 * Converts the SP question configuration into a displayable array consumable
	 * by the cdk-table component. This involves flattening the information into
	 * a rectangular array representing row/column cell data.
	 * @private
	 * @param {StatedPreferenceConfig} config
	 * @returns {Array<any>}
	 * @memberof StatedPreferenceQuestionComponent
	 */
	private transformToDisplayableData(config: StatedPreferenceConfig): Array<any> {
		let spDataArray: Array<string> = [];
		for (let r = 0; r < config.headers.length; r++) {}
		return [];
	}
}
