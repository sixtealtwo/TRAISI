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
import { StatedPreferenceConfig } from './stated-preference-config.model';

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
	 *
	 *
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
	 *
	 *
	 * @memberof StatedPreferenceQuestionComponent
	 */
	public ngOnInit(): void {
		console.log(this.configuration);

		this.questionOptions.subscribe(options => {
			console.log('got options');
			console.log(options);
			if (options.length > 0) {
				this.parseSpModel(options[0]);
			}
		});
	}
}
